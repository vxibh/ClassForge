// src/app/enrolled-classes/enrolled-classes.tsx
'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const classesList = [
  { id: 'class1', title: 'Introduction to Algorithms', description: 'Learn the basics of algorithms and data structures.' },
  { id: 'class2', title: 'Advanced Machine Learning', description: 'Dive deep into machine learning algorithms and techniques.' },
  { id: 'class3', title: 'Web Development Bootcamp', description: 'Build modern web applications using the latest technologies.' },
  // Add more classes as needed
];

const EnrolledClassesPage = () => {
  const [activeItem, setActiveItem] = useState<string>('classes');
  const router = useRouter();

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  useEffect(() => {
    setActiveItem('classes');
  }, []);

  const handleClassClick = (classId: string) => {
    router.push(`/classes/${classId}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Enrolled Classes</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classesList.map(classItem => (
              <div key={classItem.id} className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleClassClick(classItem.id)}>
                <h2 className="text-xl font-semibold mb-2">{classItem.title}</h2>
                <p className="text-gray-700">{classItem.description}</p>
              </div>
            ))}
          </div>
        </div>
        <AnnouncementBar />
      </div>
    </div>
  );
};

export default EnrolledClassesPage;
