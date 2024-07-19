'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Spinner from 'react-bootstrap/Spinner';
import { ClimbingBoxLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation'
const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false });

interface Problem {
  title: string;
  content: string;
  topicTags: { name: string }[];
}

interface User {
  _id: string;
}

const ProblemPage = () => {
  const searchParams = useSearchParams()
 
  const postId = searchParams.get('postId')
  const { problemId } = useParams<{ problemId: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  console.log(postId)
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('User details fetched:', data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUser(null);
      }
    };

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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchProblemDetails();
  }, [problemId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only"><ClimbingBoxLoader /></span>
        </Spinner>
      </div>
    );
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
          {user && (
            <CodeEditor
              user={user?._id}
              problemId={problemId}
              postId = {postId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
