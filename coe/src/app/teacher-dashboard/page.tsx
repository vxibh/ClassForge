'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import LogoutButton from '@/components/LogoutButton';
import { UserButton } from '@clerk/nextjs';

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/'); // Redirect to home if not signed in
      } else if (user.publicMetadata.role !== 'teacher') {
        signOut().then(() => {
          router.push('/'); // Redirect to home if not a teacher and log out 
        });
      }
    }
  }, [isLoaded, isSignedIn, user, router, signOut]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="flex justify-between items-center mb-6 p-4 bg-indigo-600 text-white shadow-lg rounded-lg">
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
            onClick={() => handleNavigation('/create-assignment')}
          >
            Create New Assignment
          </button>
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
            onClick={() => handleNavigation('/question-bank')}
          >
            Question Bank 
          </button>
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
            onClick={() => handleNavigation('/view-submissions')}
          >
            View Submissions
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <UserButton />
          <LogoutButton className="bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out text-white px-4 py-2 rounded shadow-md" />
        </div>
      </nav>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome Teacher</h1>
        <p className="text-gray-600">Manage your assignments, question bank, and view submissions easily from this dashboard.</p>
      </div>
    </div>
  );
}

