'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import Button from '@/components/Button'; // Adjust the path as per your directory structure

export default function Register() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, password, role } = formData;

    try {
      // Create user with Clerk
      const result = await signUp?.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // If email verification is required, handle it here
      // await signUp.attemptEmailAddressVerification({ code: 'your-verification-code' });

      // Check if the sign-up process is complete
      if (result && result.status === 'complete') {
        router.push('/redirect-handler');
      }
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  // Render loading state if Clerk is not loaded
  if (!isLoaded) {
    return <div className="spinner-border" role="status"> <span className="sr-only"> Loading... </span> </div>;
  }

  // Render the registration form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}
