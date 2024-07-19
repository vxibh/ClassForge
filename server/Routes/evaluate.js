const express = require('express');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const router = express.Router();

const app = express();
const port = 5000; // You can choose any port

app.use(express.json());

// Function to fetch problem details from LeetCode GraphQL API
async function fetchProblemDetail(titleSlug) {
    const url = 'https://leetcode.com/graphql/';
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({
        query: `query problemDetail($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                titleSlug
                content
                exampleTestcaseList
            }
        }`,
        variables: { titleSlug }
    });

    try {
        const response = await fetch(url, { method: 'POST', headers, body });
        if (!response.ok) throw new Error(`Fetch problem detail failed with status ${response.status}`);
        const result = await response.json();
        console.log('Problem detail fetched:', result);
        return result.data.question;
    } catch (error) {
        console.error('Fetch problem detail error:', error);
        throw error;
    }
}

// Function to extract expected output from HTML content
function extractExpectedOutput(htmlContent) {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const outputElements = document.querySelectorAll('pre');

    console.log('Output Elements:', outputElements.length);

    const outputs = Array.from(outputElements).map(pre => {
        let text = pre.textContent.trim();
        console.log('Pre Text:', text);

        // Update regex pattern to match the plain output
        const match = text.match(/Output:\s*(\S+)/);

        if (match) {
            console.log('Matched Output:', match[1]);
            const outputText = match[1];
            return normalizeWhitespace(outputText);
        }

        return ''; // Return empty if no expected output found
    }).filter(output => output.length > 0); // Filter out empty outputs

    console.log('Extracted expected outputs:', outputs);
    return outputs;
}

// Function to remove all whitespace from a string
function removeAllWhitespace(str) {
    return str.replace(/[\s\uFEFF\xA0]+/g, ''); // Remove all whitespace characters including tabs, newlines, and Unicode invisible characters
}

// Function to compare actual and expected outputs
function compareOutputs(expected, actual) {
    const cleanedExpected = removeAllWhitespace(expected);
    const cleanedActual = removeAllWhitespace(actual);
    return cleanedExpected === cleanedActual;
}


// Function to normalize whitespace
function normalizeWhitespace(str) {
    return str.replace(/\s+/g, ' ').trim();
}

// Function to fetch results for a given set of tokens
async function fetchResults(tokens) {
    const tokensParam = tokens.join(',');
    const url = `http://localhost:2358/submissions/batch?tokens=${tokensParam}&base64_encoded=false&wait=true`;
    const headers = { 'Content-Type': 'application/json' };

    console.log('Fetching results from URL:', url);

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`Fetch result failed with status ${response.status}`);
        const result = await response.json();
        console.log('Fetch result response:', result);
        return result;
    } catch (error) {
        console.error('Fetch result error:', error);
        throw error;
    }
}

// Function to check results until all are complete
async function checkResultsUntilComplete(tokens, interval = 2000) {
    let allComplete = false;
    let results = null;

    while (!allComplete) {
        results = await fetchResults(tokens);
        allComplete = results.submissions.every(sub => sub.status.id !== 1 && sub.status.id !== 2); // Check if all are not in queue or processing
        if (!allComplete) {
            console.log('Submissions are still processing, waiting...');
            await new Promise(resolve => setTimeout(resolve, interval)); // Wait for a while before checking again
        }
    }

    console.log('All submissions are complete');
    return results;
}

// Function to submit a batch of code submissions
async function submitBatch(submissions) {
    const url = 'http://localhost:2358/submissions/batch?base64_encoded=false&wait=true';
    const headers = { 'Content-Type': 'application/json' };

    console.log('Submitting batch to URL:', url);
    console.log('Submissions payload:', submissions);

    try {
        if (submissions.length === 0) {
            throw new Error('No submissions to send');
        }

        const payload = { submissions };
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Submit batch failed with status ${response.status}: ${errorText}`);
        }

        const submissionResponse = await response.json();
        console.log('Submit batch response:', submissionResponse);
        return submissionResponse;
    } catch (error) {
        console.error('Submit batch error:', error);
        throw error;
    }
}

// Endpoint to evaluate problem submissions
router.post('/', async (req, res) => {
    try {
        const { problemSubmissions } = req.body;
        console.log('Received problem submissions:', problemSubmissions);

        const submissions = await Promise.all(
            problemSubmissions.map(async (submission) => {
                const problemDetail = await fetchProblemDetail(submission.problemId);
                const { exampleTestcaseList, content } = problemDetail;
                const expectedOutputs = extractExpectedOutput(content);

                if (expectedOutputs.length !== exampleTestcaseList.length) {
                    console.error('Mismatch between the number of test cases and expected outputs');
                    console.error('Expected Outputs:', expectedOutputs);
                    console.error('Example Testcase List:', exampleTestcaseList);
                    throw new Error('Mismatch between the number of test cases and expected outputs');
                }

                return exampleTestcaseList.map((stdin, index) => ({
                    source_code: submission.code,
                    language_id: 63, // Adjust as needed
                    stdin,
                    expected_output: expectedOutputs[index]
                }));
            })
        );

        const flattenedSubmissions = submissions.flat();
        console.log('Flattened submissions:', flattenedSubmissions);

        const submissionResponse = await submitBatch(flattenedSubmissions);
        const tokens = submissionResponse.map(sub => sub.token);
        console.log('Submission tokens:', tokens);

        const results = await checkResultsUntilComplete(tokens);
        console.log('Results:', results);

        results.submissions.forEach((submissionResult, index) => {
            const expectedOutput = flattenedSubmissions[index].expected_output;
            const actualOutput = submissionResult?.stdout?.trim() || 'N/A';
            
            const cleanedExpected = removeAllWhitespace(expectedOutput);
            const cleanedActual = removeAllWhitespace(actualOutput);

            const isMatch = compareOutputs(cleanedExpected, cleanedActual);

            console.log(`Test Case ${index + 1}:`);
            console.log(`Expected Output: ${cleanedExpected}`);
            console.log(`Actual Output: ${cleanedActual}`);
            console.log('Match:', isMatch ? 'Yes' : 'No');
            console.log('Execution Time:', submissionResult?.time);
            console.log('Memory Usage:', submissionResult?.memory);
            console.log('Status:', submissionResult?.status?.description);
            console.log('-------------------------------------');
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Evaluation error:', error);
        res.status(500).json({ error: 'Failed to evaluate submissions' });
    }
});

module.exports = router;
