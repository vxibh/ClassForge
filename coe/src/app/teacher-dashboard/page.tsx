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
    return <div className="spinner-border" role="status"> <span className="sr-only"> Loading... </span> </div>; // Optionally render a loading indicator here
  }

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <LogoutButton />
      <UserButton /> 
    </div>
  );
}
