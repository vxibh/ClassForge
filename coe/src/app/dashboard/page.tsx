'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';
import { ClimbingBoxLoader } from 'react-spinners';

export default function Dashboard() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: 'User' });

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
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
      console.log('User details fetched:', data); // Log the response
      return data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  const checkLoggedInStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsSignedIn(true);
      const userDetails = await fetchUserDetails();
      if (userDetails) {
        setUserDetails(userDetails);
      } else {
        setUserDetails({ name: 'User' }); // Fallback
      }
    } else {
      setIsSignedIn(false);
      router.push('/');
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    checkLoggedInStatus();
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        checkLoggedInStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  const handleMenuItemClick = (itemId) => {
    // Implement logic to change content based on the clicked menu item if needed
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <div>Welcome, {userDetails?.name || 'User'}</div>
          {/* Add your main content here */}
        </div>
        <AnnouncementBar />
      </div>
    </div>
  );
}
