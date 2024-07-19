import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

// Function to fetch problem details from LeetCode GraphQL API
export async function fetchProblemDetail(titleSlug: string) {
    const url = 'https://leetcode.com/graphql/';
    const headers = {
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        query: `query problemDetail($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                titleSlug
                content
                exampleTestcaseList
            }
        }`,
        variables: {
            titleSlug: titleSlug
        }
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body
        });
        if (!response.ok) {
            throw new Error(`Fetch problem detail failed with status ${response.status}`);
        }
        const result = await response.json();
        return result.data.question;
    } catch (error) {
        console.error('Fetch problem detail error:', error);
        throw error;
    }
}

// Function to extract expected output from HTML content
export function extractExpectedOutput(htmlContent: string) {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const outputElements = document.querySelectorAll('pre');
    const expectedOutputs = Array.from(outputElements).map(pre => pre.textContent.trim());
    return expectedOutputs;
}

// Function to fetch results for a given set of tokens
export async function fetchResults(tokens: string[]) {
    const tokensParam = tokens.join(',');
    const url = `http://localhost:2358/submissions/batch?tokens=${tokensParam}&base64_encoded=false&wait=true`;
    const headers = { 'Content-Type': 'application/json' };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Fetch result failed with status ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Fetch result error:', error);
        throw error;
    }
}

// Function to check results until all are complete
export async function checkResultsUntilComplete(tokens: string[], interval = 2000) {
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

    return results;
}

// Function to submit a batch of code submissions
export async function submitBatch(submissions: any[]) {
    const url = 'http://localhost:2358/submissions/batch?base64_encoded=false&wait=true';
    const headers = { 'Content-Type': 'application/json' };

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
        return submissionResponse;
    } catch (error) {
        console.error('Submit batch error:', error);
        throw error;
    }
}

// Function to evaluate problem submissions for multiple titleSlugs
export async function evaluateSubmissions(problemSubmissions: any[], fetchProblemDetail: Function, submitBatch: Function, checkResultsUntilComplete: Function) {
    const submissionsToEvaluate = problemSubmissions.map(async (submission) => {
        console.log(`Processing problem: ${submission.problemId}`);
        try {
            const problemDetail = await fetchProblemDetail(submission.problemId);
            const { exampleTestcaseList, content } = problemDetail;
            
            const expectedOutputs = extractExpectedOutput(content);

            if (expectedOutputs.length !== exampleTestcaseList.length) {
                throw new Error('Mismatch between the number of test cases and expected outputs');
            }

            const sourceCode = submission.code; // Use the source code from the submission
            const languageId = 76; // Replace with the actual language ID if needed
            const submissions = exampleTestcaseList.map((stdin: string, index: number) => ({
                source_code: sourceCode,
                language_id: languageId,
                stdin: stdin,
                expected_output: expectedOutputs[index]
            }));

            const submissionResponse = await submitBatch(submissions);

            const tokens = submissionResponse.map((sub: any) => sub.token);
            console.log('Tokens:', tokens);

            const results = await checkResultsUntilComplete(tokens);

            results.submissions.forEach((submissionResult: any, index: number) => {
                const expectedOutput = expectedOutputs[index];
                const actualOutput = submissionResult?.stdout?.trim() || 'N/A';
                console.log(`Test Case ${index + 1}:`);
                console.log(`Input: ${exampleTestcaseList[index]}`);
                console.log(`Expected Output: ${expectedOutput}`);
                console.log(`Actual Output: ${actualOutput}`);
                console.log('Execution Time:', submissionResult?.time);
                console.log('Memory Usage:', submissionResult?.memory);
                console.log('Status:', submissionResult?.status?.description);
                console.log('-------------------------------------');
            });
        } catch (error) {
            console.error('Error:', error);
        }
    });

    await Promise.all(submissionsToEvaluate); // Wait for all evaluations to complete
}
