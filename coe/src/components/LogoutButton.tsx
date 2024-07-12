'use client';

import { useRouter } from 'next/navigation';
import Button from './Button';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Remove the token from local storage
      localStorage.removeItem('token');
      // Redirect to home after logout
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Logout
    </Button>
  );
}
