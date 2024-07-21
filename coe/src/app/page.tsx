'use client';

import { useEffect, useState, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { HashLoader } from 'react-spinners';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkLoggedInStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
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
  }, []);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/login');
    }, 1500); // Delay for 1 second
  };

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/register');
    }, 1500); // Delay for 1 second
  };

  const handleDashboard = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard'); // Replace with the actual dashboard route
    }, 2000); // Delay for 1 second
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('storage'));
    setLoading(true);
    setTimeout(() => {
      router.push('/');
    }, 1500); // Delay for 1 second
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 relative">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-gray-800">Welcome to ClassForge</h1>
        <p className="text-gray-600 mb-8 text-center">Your platform for seamless classroom management.</p>
        <div className="space-y-4">
          {isLoggedIn ? (
            <>
              <Button
                onClick={handleDashboard}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Go to Dashboard'}
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Login
              </Button>
              <Button
                onClick={handleSignUp}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-50 bg-opacity-75 z-50">
            <div className="sweet-loading">
            <HashLoader
              color="#fc03c2"
              loading={loading}
              size={40}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
