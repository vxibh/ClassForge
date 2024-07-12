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
  const [userDetails, setUserDetails] = useState(null);

  const checkLoggedInStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsSignedIn(true);
      // Fetch user details here if needed
      setUserDetails({ name: 'John Doe' }); // Placeholder, replace with actual user details
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

  if (!isLoaded) {
    return <div> <ClimbingBoxLoader /> </div>;
  }

  const handleMenuItemClick = (itemId) => {
    // Implement logic to change content based on the clicked menu item if needed
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <div>Welcome, {userDetails?.name}</div>
          {/* Add your main content here */}
        </div>
        <AnnouncementBar />
      </div>
    </div>
  );
}
