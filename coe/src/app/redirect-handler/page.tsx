// src/pages/redirect-handler.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useUser } from '@clerk/nextjs';

export default function RedirectHandler() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    // Check if the user is signed in
    if (!isSignedIn) {
      // Redirect to home if not signed in
      router.push('/');
      return;
    }

    // Check the user's role and redirect accordingly
    if (user) {
      const role = user.publicMetadata?.role;

      if (role === 'student') {
        router.push('/student-dashboard');
      } else if (role === 'teacher') {
        router.push('/teacher-dashboard');
      } else {
        // Default case: Redirect to home if role is undefined or unrecognized
        router.push('/');
      }
    }
  }, [isSignedIn, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Redirecting...</h2>
      </div>
    </div>
  );
}
