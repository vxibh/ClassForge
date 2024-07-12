'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const EnrolledClassesPage = () => {
  const [activeItem, setActiveItem] = useState<string>('classes');
  const [classesList, setClassesList] = useState([]);
  const router = useRouter();

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await fetch('http://localhost:5000/api/classes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the authorization header
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      console.log(data);
      if (Array.isArray(data)) {
        setClassesList(data);
      } else {
        console.error('Unexpected data format:', data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };
  

  useEffect(() => {
    setActiveItem('classes');
    fetchClasses();
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
            {Array.isArray(classesList) ? (
              classesList.map((classItem) => (
                <div
                  key={classItem._id}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleClassClick(classItem._id)}
                >
                  <h2 className="text-xl font-semibold mb-2">{classItem.title}</h2>
                  <p className="text-gray-700">{classItem.description}</p>
                </div>
              ))
            ) : (
              <p>No classes available</p>
            )}
          </div>
        </div>
        <AnnouncementBar />
      </div>
    </div>
  );  
}
export default EnrolledClassesPage;
