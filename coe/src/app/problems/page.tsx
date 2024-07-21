'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useRouter } from 'next/navigation';
import { HashLoader } from 'react-spinners';

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState<string>('problems');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [problemsPerPage] = useState<number>(6);
  const router = useRouter();

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handleProblemClick = (problemId: string) => {
    setLoading(true);
    router.push(`/problems/${problemId}`);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#fc03c2" loading={loading} size={40} aria-label="Loading Spinner" data-testid="loader" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Calculate the index of the last problem to display
  const indexOfLastProblem = currentPage * problemsPerPage;
  // Calculate the index of the first problem to display
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  // Slice the problems array to get the problems for the current page
  const currentProblems = problems.slice(indexOfFirstProblem, indexOfLastProblem);

  // Determine if "Previous" and "Next" buttons should be disabled
  const isFirstPage = currentPage === 1;
  const isLastPage = indexOfLastProblem >= problems.length;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} activeItem={activeItem} />
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Coding Problems</h1>
          <ul className="space-y-3">
            {currentProblems.map(problem => (
              <li key={problem.titleSlug} className="p-3 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">{problem.title}</h2>
                  <button
                    onClick={() => handleProblemClick(problem.titleSlug)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                  >
                    View Problem
                  </button>
                </div>
                <div
                  className="mt-4 text-gray-800"
                  dangerouslySetInnerHTML={{ __html: problem.content }}
                />
                <p className="mt-2 text-gray-600">Tags: {problem.topicTags.map(tag => tag.name).join(', ')}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={isFirstPage}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none ${isFirstPage ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </button>
            {!isLastPage && (
              <button
                onClick={handleNextPage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
              >
                Next
              </button>
            )}
          </div>
        </div>
        <AnnouncementBar />
      </div>
    </div>
  );
};

export default ProblemsPage;
