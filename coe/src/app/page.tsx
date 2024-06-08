"use client"
import { SignInButton, useClerk } from '@clerk/nextjs';

export default function Home() {
  const { openSignIn } = useClerk();

  const handleStudentLogin = () => {
    openSignIn({
      afterSignInUrl: '/student-dashboard',
    });
  };

  const handleTeacherLogin = () => {
    openSignIn({
      afterSignInUrl: '/teacher-dashboard',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login or Register</h2>
        <div className="space-y-4">
          <button
            onClick={handleStudentLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login as Student
          </button>
          <button
            onClick={handleTeacherLogin}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login as Teacher
          </button>
        </div>
      </div>
    </div>
  );
}
