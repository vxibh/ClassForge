// pages/problems/[problemId].tsx
'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false });

interface Problem {
  title: string;
  content: string;
  topicTags: { name: string }[];
}

const ProblemPage = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      if (!problemId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/problems/${problemId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.question) {
          throw new Error('Problem not found');
        }

        setProblem(data.question);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [problemId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!problem) {
    return <div>Problem not found</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 p-4 bg-gray-100 overflow-y-auto mt-14">
        <div className="w-1/2 pr-4">
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <p className="mb-4" dangerouslySetInnerHTML={{ __html: problem.content }} />
          <p className="mb-4">Tags: {problem.topicTags.map(tag => tag.name).join(', ')}</p>
        </div>
        <div className="w-1/2 min-h-full bg-gray-900 text-gray-500 px-6 py-8">
          <CodeEditor />
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
