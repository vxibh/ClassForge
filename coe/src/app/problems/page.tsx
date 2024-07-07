'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const problemsList = [
  { id: 'problem1', title: 'Two Sum' },
  { id: 'problem2', title: 'Reverse Linked List' },
  { id: 'problem3', title: 'Valid Parentheses' },
  // Add more problems as needed
];

const ProblemsPage = () => {
  const [activeItem, setActiveItem] = useState<string>('problems');
  const router = useRouter();
  const searchParams = useSearchParams();

  const classId = searchParams.get('classId');
  const postId = searchParams.get('postId');

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  useEffect(() => {
    setActiveItem('problems');
  }, []);

  const handleProblemClick = (problemId: string) => {
    router.push(`/problems/${problemId}?classId=${classId}&postId=${postId}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Coding Problems</h1>
          <ul>
            {problemsList.map(problem => (
              <li key={problem.id} className="mb-2">
                <a
                  href="#"
                  onClick={() => handleProblemClick(problem.id)}
                  className="text-blue-500 hover:underline"
                >
                  {problem.title}
                </a>
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
