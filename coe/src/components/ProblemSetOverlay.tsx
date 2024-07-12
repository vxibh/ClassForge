import React, { useState, useEffect } from 'react';

export interface Problem {
  title: string;
  titleSlug: string;
}

interface ProblemSetOverlayProps {
  onClose: () => void;
  onSelectProblems: (selectedProblems: Problem[]) => void;
}

const ProblemSetOverlay: React.FC<ProblemSetOverlayProps> = ({ onClose, onSelectProblems }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [problemsPerPage] = useState<number>(13);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('/api/problems');
        const data = await response.json();
        setProblems(data);
        setFilteredProblems(data); // Initialize filtered problems with all problems
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  // Filter problems based on search term
  useEffect(() => {
    const filtered = problems.filter(problem =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProblems(filtered);
  }, [searchTerm, problems]);

  // Paginate problems
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCheckboxChange = (problem: Problem) => {
    setSelectedProblems(prevSelectedProblems =>
      prevSelectedProblems.some(p => p.titleSlug === problem.titleSlug)
        ? prevSelectedProblems.filter(p => p.titleSlug !== problem.titleSlug)
        : [...prevSelectedProblems, problem]
    );
  };

  const handleOkClick = () => {
    onSelectProblems(selectedProblems);
    onClose();
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/2 h-3/4 overflow-y-auto relative">
        <button
          onClick={handleCloseClick}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4">Select Problems from Problem Set</h2>
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <ul>
          {currentProblems.map(problem => (
            <li key={problem.titleSlug} className="mb-2">
              <label>
                <input
                  type="checkbox"
                  checked={selectedProblems.some(p => p.titleSlug === problem.titleSlug)}
                  onChange={() => handleCheckboxChange(problem)}
                  className="mr-2"
                />
                {problem.title}
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between">
          <div>
            {currentPage > 1 && (
              <button
                onClick={() => paginate(currentPage - 1)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Previous
              </button>
            )}
            {currentProblems.length === problemsPerPage && (
              <button
                onClick={() => paginate(currentPage + 1)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            )}
            <span className="ml-2 text-gray-500">
              Page {currentPage} of {Math.ceil(filteredProblems.length / problemsPerPage)}
            </span>
          </div>
          <div>
            <button onClick={handleOkClick} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSetOverlay;
