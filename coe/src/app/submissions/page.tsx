'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HashLoader } from 'react-spinners';

const EnrolledClassesPage = () => {
  const [activeItem, setActiveItem] = useState<string>('classes');
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/classes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setClassesList(data);
      } else {
        console.error('Unexpected data format:', data);
      }
    }
    
    catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes.');
    } finally {
      // Simulate additional loading time
      setTimeout(() => {
        setLoading(false);
      }, 2000); // Adjust the delay time as needed
    }
  };

  useEffect(() => {
    setActiveItem('classes');
    fetchClasses();
  }, []);

  const handleClassClick = async (classId: string) => {
    setLoading(true);
    try {
      setTimeout(() => {
        router.push(`/submissions/${classId}`);
      }, 3000);
    } catch (error) {
      console.error('Error navigating to class:', error);
    }
    setLoading(false); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#fc03c2" loading={loading} size={40} aria-label="Loading Spinner" data-testid="loader" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Enrolled Classes</h1>
          <div className="grid grid-cols-1 gap-4">
            {Array.isArray(classesList) && classesList.length > 0 ? (
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
      </div>
    </div>
  );
};

export default EnrolledClassesPage;
