'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/'); // Redirect to home if not signed in
      } else if (user.publicMetadata.role !== 'student') {
        signOut().then(() => {
          router.push('/'); // Redirect to home if not a student and log out
        });
      }
    }
  }, [isLoaded, isSignedIn, user, router, signOut]);

  if (!isLoaded) {
    return <div className="spinner-border" role="status"> <span className="sr-only"> Loading... </span> </div>; // Optionally render a loading indicator here
  }
  const handleMenuItemClick = (itemId: string) => {
    // Implement logic to change content based on the clicked menu item if needed
  };


  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{marginTop:"56px"}}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          {/* Add your main content here */}
        </div>
        <AnnouncementBar />
      </div>
    </div>
  );
}
