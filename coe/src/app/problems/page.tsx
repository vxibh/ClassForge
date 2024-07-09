// pages/problems.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useRouter } from 'next/navigation';


const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState<string>('problems');
  const router = useRouter();

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handleProblemClick = (problemId: string) => {
    router.push(`/problems/${problemId}`);
    console.log(problemId); 
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('/api/problems');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProblems(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} activeItem={activeItem} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Coding Problems</h1>
          <ul>
            {problems.map(problem => (
              <li key={problem.titleSlug} className="mb-8">
                                

                <h2 className="text-xl font-bold">{problem.title}</h2>
                <div
                  className="mt-4 text-gray-800"
                  // dangerouslySetInnerHTML={{ __html: problem.content }}
                />
                <p className="mt-2 text-gray-600">Tags: {problem.topicTags.map(tag => tag.name).join(', ')}</p>
                <button
                  onClick={() => handleProblemClick(problem.titleSlug)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                  { console.log(problem.titleSlug) }
                  View Problem
                </button>
              </li>
            ))}
          </ul>
        </div>
        <AnnouncementBar />
      </div>
    </div>
  );
};

export default ProblemsPage;
