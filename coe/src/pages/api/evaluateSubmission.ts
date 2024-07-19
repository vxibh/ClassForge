import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchProblemDetail, submitBatch, checkResultsUntilComplete, extractExpectedOutput } from '../../lib/evaluation'; // Adjust the import path as needed

interface ProblemSubmission {
  _id: string;
  problemId: string;
  userId: string;
  submission: string;
  createdAt: Date;
  code: string;
}

interface EvaluateRequest {
  problemSubmissions: ProblemSubmission[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problemSubmissions }: EvaluateRequest = req.body;

    const submissions = await Promise.all(
      problemSubmissions.map(async (submission) => {
        const problemDetail = await fetchProblemDetail(submission.problemId);
        const { exampleTestcaseList, content } = problemDetail;

        const expectedOutputs = extractExpectedOutput(content);

        if (expectedOutputs.length !== exampleTestcaseList.length) {
          throw new Error('Mismatch between the number of test cases and expected outputs');
        }

        return exampleTestcaseList.map((stdin, index) => ({
          source_code: submission.code,
          language_id: 76, // Adjust as needed
          stdin,
          expected_output: expectedOutputs[index]
        }));
      })
    );

    const flattenedSubmissions = submissions.flat();
    const submissionResponse = await submitBatch(flattenedSubmissions);

    const tokens = submissionResponse.map(sub => sub.token);
    const results = await checkResultsUntilComplete(tokens);

    res.status(200).json(results);
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: 'Failed to evaluate submissions' });
  }
}
