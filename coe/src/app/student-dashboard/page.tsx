'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import LogoutButton from '@/components/LogoutButton';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

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

  return (
    <div>
      <h1>Student Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
