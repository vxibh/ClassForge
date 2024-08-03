const express = require('express');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const router = express.Router();
const PostSubmission = require('../models/postsubmission.model'); // Assuming you have a PostSubmission model
const ProblemSubmission = require('../models/problemSubmission.model'); // Assuming you have a ProblemSubmission model

router.use(express.json()); // Correct middleware usage

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
        //console.log('Problem detail fetched:', result);
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
  
  const outputElements = document.querySelectorAll('pre, .example-block p');

  const outputs = Array.from(outputElements).map(element => {
      let text = element.textContent.trim();

      // Check if the element is from an example block
      if (element.parentElement && element.parentElement.classList.contains('example-block')) {
          const match = text.match(/Output:\s*(\S+)/);
          if (match) {
              return normalizeWhitespace(match[1]);
          }
      } else {
          // Handle pre elements or other generic output formats
          const match = text.match(/Output:\s*(\S+)/);
          if (match) {
              return normalizeWhitespace(match[1]);
          }
      }

      return ''; // Return empty if no expected output found
  }).filter(output => output.length > 0); // Filter out empty outputs

  return outputs;
}

function removeAllSpecialCharsAndLowercase(str) {
  return str
    .replace(/[\[\](),.\s\u200B-\u200D\uFEFF\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000"'`~´]+/g, '')
    .toLowerCase();
}


// Function to compare actual and expected outputs
function compareOutputs(expected, actual) {
    console.log('Expected:', expected);
    console.log('Actual:', actual);
    const cleanedExpected = removeAllSpecialCharsAndLowercase(expected);
    const cleanedActual = removeAllSpecialCharsAndLowercase(actual);
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

    //console.log('Fetching results from URL:', url);

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`Fetch result failed with status ${response.status}`);
        const result = await response.json();
        //console.log('Fetch result response:', result, result.status);
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
   // console.log('Submissions payload:', submissions);

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

router.post('/', async (req, res) => {
    try {
      const { problemSubmissions } = req.body;
  
      // Fetch existing evaluated submissions
      const evaluatedSubmissions = await ProblemSubmission.find({
        _id: { $in: problemSubmissions.map(sub => sub._id) },
        evaluated: true,
      }).select('_id problemId');
  
      // Create a set of evaluated submission IDs for easy lookup
      const evaluatedSubmissionIds = new Set(evaluatedSubmissions.map(sub => sub._id.toString()));
  
      // Filter out already evaluated submissions
      const pendingSubmissions = problemSubmissions.filter(sub => !evaluatedSubmissionIds.has(sub._id.toString()));
      const skippedSubmissions = problemSubmissions.filter(sub => evaluatedSubmissionIds.has(sub._id.toString()));
  
      if (skippedSubmissions.length > 0) {
        console.log('Skipped submissions:', skippedSubmissions.map(sub => sub.problemId));
      }
  
      if (pendingSubmissions.length === 0) {
        return res.status(200).json({
          message: 'All submissions have already been evaluated.',
          skippedSubmissions: skippedSubmissions.map(sub => ({
            problemId: sub.problemId,
            message: 'Already evaluated'
          }))
        });
      }
  
      // Fetch problem details and flatten submissions for pending submissions
      const submissions = await Promise.all(
        pendingSubmissions.map(async (submission) => {
          const problemDetail = await fetchProblemDetail(submission.problemId);
          const { exampleTestcaseList, content } = problemDetail;
          const expectedOutputs = extractExpectedOutput(content);
          console.log('Expected Outputs:', expectedOutputs);
          if (expectedOutputs.length !== exampleTestcaseList.length) {
            console.error('Mismatch between the number of test cases and expected outputs');
            console.error('Expected Outputs:', expectedOutputs);
            console.error('Example Testcase List:', exampleTestcaseList);
            throw new Error('Mismatch between the number of test cases and expected outputs');
          }
      
          return exampleTestcaseList.map((stdin, index) => {
            const formattedStdin = formatInput(stdin);
            console.log('formatted:', formattedStdin);
            return {
              source_code: submission.code,
              language_id: 76, // Adjust as needed
              stdin: formattedStdin,
              expected_output: expectedOutputs[index],
            };
          });
        })
      );
      
      function formatInput(input) {
        console.log('input type:', typeof input);
        if (typeof input === 'string' && input.startsWith('[') && input.endsWith(']')) {
          // Convert string to array
          input = JSON.parse(input);
        }
        
        if (Array.isArray(input)) {
          // Remove brackets and replace commas with spaces
          return input.join(' ');
        } else if (typeof input === 'string') {
          // Remove quotes
          return input.replace(/['"]+/g, '');
        }
        return input;
      }
       
      const flattenedSubmissions = submissions.flat();
  
      const submissionResponse = await submitBatch(flattenedSubmissions);
      const tokens = submissionResponse.map(sub => sub.token);
  
      const results = await checkResultsUntilComplete(tokens);
  
      const resultsWithPassedCount = results.submissions.map((submissionResult, index) => {
        const expectedOutput = flattenedSubmissions[index].expected_output;
        const actualOutput = submissionResult?.stdout?.trim() || 'N/A';
        // console.log(submissionResult);
  
        const cleanedExpected = removeAllSpecialCharsAndLowercase(expectedOutput);
        const cleanedActual = removeAllSpecialCharsAndLowercase(actualOutput);
  
        const isMatch = compareOutputs(cleanedExpected, cleanedActual);
  
        console.log('Expected:', cleanedExpected);
        console.log('Our Code:', cleanedActual);
        return {
          ...submissionResult,
          passed: isMatch ? 1 : 0,
          expectedOutput: cleanedExpected,
          actualOutput: cleanedActual,
          status: submissionResult?.status?.description,
          executionTime: submissionResult?.time,
          memoryUsage: submissionResult?.memory
        };
      });
  
      // Calculate results for each problem and update the database
      const problemResults = await Promise.all(pendingSubmissions.map(async (submission, problemIndex) => {
        const problemDetail = await fetchProblemDetail(submission.problemId);
        const { exampleTestcaseList } = problemDetail;
  
        const problemResults = resultsWithPassedCount.slice(
          problemIndex * exampleTestcaseList.length,
          (problemIndex + 1) * exampleTestcaseList.length
        );
  
        const passedCount = problemResults.reduce((count, result) => count + result.passed, 0);
  
        // Store problem results in the database
        await ProblemSubmission.findByIdAndUpdate(
          submission._id,
          { score: passedCount, 
            evaluated: true,
            totalNumberOfTestCases: exampleTestcaseList.length
           },
        );
  
        return {
          problemId: submission.problemId,
          passedTestCases: passedCount,
          totalTestCases: problemResults.length,
          results: problemResults
        };
      }));
  
      // Update the total score for the post
      const postSubmissionId = pendingSubmissions[0]?.postId; // Assuming all problem submissions belong to the same post
      if (postSubmissionId) {
        const updatedProblemSubmissions = await ProblemSubmission.find({ postId: postSubmissionId });
        const totalScore = updatedProblemSubmissions.reduce((sum, ps) => sum + (ps.score || 0), 0);
        await PostSubmission.findByIdAndUpdate(postSubmissionId, { totalScore });
      }
  
      res.status(200).json({
        message: 'Evaluation complete',
        problems: problemResults,
        skippedSubmissions: skippedSubmissions.map(sub => ({
          problemId: sub.problemId,
          message: 'Already evaluated'
        }))
      });
  
    } catch (error) {
      console.error('Evaluation error:', error);
      res.status(500).json({ error: 'Failed to evaluate submissions' });
    }
  });
  
module.exports = router
