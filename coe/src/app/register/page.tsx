"use client"
import { useState } from 'react';
import axios from 'axios';

const Register = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log(res.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
      <input type="number" name="batch" placeholder="Batch (1-9)" min="1" max="9" onChange={handleChange} required={!formData.isTeacher} disabled={formData.isTeacher} />
      <label>
        <input type="checkbox" name="isTeacher" onChange={handleChange} />
        I am a teacher
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
