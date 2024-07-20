'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HashLoader } from 'react-spinners';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const token = res.data.token; // Get token from response data
      localStorage.setItem('token', token); // Save token to localStorage
      toast.success('Login successful!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000); 
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data.message || 'Login failed');
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username or Email</label>
            <input 
              type="text" 
              name="usernameOrEmail" 
              placeholder="Username or Email" 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" 
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:text-blue-700">
            Sign up
          </Link>
        </p>
        <ToastContainer />
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
  );
};

export default Login;
