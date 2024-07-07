'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false });

interface Problem {
  title: string;
  description: string;
  constraints: string;
  examples: { input: string; output: string }[];
}

const problemsData: Record<string, Problem> = {
  'problem1': {
    title: 'Two Sum',
    description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
    constraints: '1 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: 'Output: [0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: 'Output: [1,2]' },
    ],
  },
  // Add more problems as needed
};

const ProblemPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const problemId = params.problemId;

  const classId = searchParams.get('classId');
  const postId = searchParams.get('postId');

  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    if (problemId && typeof problemId === 'string' && problemId in problemsData) {
      setProblem(problemsData[problemId]);
    } else {
      setProblem(null);
    }
  }, [problemId]);

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 p-4 bg-gray-100 overflow-y-auto mt-14">
        <div className="w-1/2 pr-4">
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <p className="mb-4">{problem.description}</p>
          <h2 className="text-xl font-semibold mb-2">Constraints:</h2>
          <pre className="mb-4">{problem.constraints}</pre>
          <h2 className="text-xl font-semibold mb-2">Examples:</h2>
          <ul>
            {problem.examples.map((example, index) => (
              <li key={index} className="mb-2">
                <pre><strong>Input:</strong> {example.input}</pre>
                <pre><strong>Output:</strong> {example.output}</pre>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 min-h-full bg-gray-900 text-gray-500 px-6 py-8">
          <CodeEditor classId={classId} postId={postId} />
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
