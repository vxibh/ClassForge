'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpButton, useClerk, useUser } from '@clerk/nextjs';
import Button from '@/components/Button';

export default function Home() {
  const { openSignIn, signOut } = useClerk();
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      if (user.publicMetadata.role === 'student') {
        router.push('/student-dashboard'); // Redirect to student dashboard
      } else if (user.publicMetadata.role === 'teacher') {
        router.push('/teacher-dashboard'); // Redirect to teacher dashboard 
      }
    }
  }, [isLoaded, isSignedIn, user, router]);  

  const handleCreateClassroom = async (formData) => {
    try {
      const response = await fetch('http://localhost:3000/create-classroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        console.log('Classroom created successfully:', data.classroom);
        // Optionally update state or fetch courses again after creating classroom
      } else {
        console.error('Failed to create classroom:', data.error);
      }
    } catch (error) {
      console.error('Error creating classroom:', error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome</h2>
        <div className="space-y-4">
          <Button onClick={() => openSignIn({})} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Login
          </Button>
              <SignUpButton>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'>
              Sign up
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}