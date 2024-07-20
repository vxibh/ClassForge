'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HashLoader } from 'react-spinners';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    batch: 1,
    isTeacher: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log(res.data);
      toast.success('Registration successful!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        toast.error(error.response.data.message || 'Registration failed');
      } else {
        console.error(error.message);
        toast.error('An error occurred');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" 
            />
          </div>
          <div>
            <label className="block text-gray-700">Username</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" 
            />
          </div>
          <div>
            <label className="block text-gray-700">Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
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
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" 
            />
          </div>
          <div>
            <label className="block text-gray-700">Batch</label>
            <input 
              type="number" 
              name="batch" 
              placeholder="Batch (1-9)" 
              min="1" 
              max="9" 
              onChange={handleChange} 
              required={!formData.isTeacher} 
              disabled={formData.isTeacher} 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" 
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="isTeacher" 
              onChange={handleChange} 
              className="mr-2" 
            />
            <label className="text-gray-700">I am a teacher</label>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
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

export default Register;
