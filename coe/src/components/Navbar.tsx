import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaRegUserCircle, FaCaretDown } from 'react-icons/fa';
import LogoutButton from './LogoutButton'; // Adjust the import path as necessary
import axios from 'axios';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [data, setData] = useState<{ name: string }>({ name: '' });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (!token) {
          throw new Error('No token found');
        }
  
        const response = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('User details fetched:', data); // Log the response
        setData({ name: data.name });        
        // Set the isTeacher state based on the fetched user data
        setIsTeacher(data.isTeacher);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  
  return (
    <nav className="w-full h-16 bg-gray-700 fixed top-0 left-0 right-0 bottom-0" style={{"zIndex" : 1000}}>
      <div className="flex justify-between mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div className="flex items-center" style={{ }}>
          <Link href="/" legacyBehavior>
            <h2 className="text-2xl text-red-500 font-bold cursor-pointer">ClassForge</h2>
          </Link>
          <ul className="flex items-center ml-10 space-x-6">
            <li className="text-xl text-white py-2 hover:bg-purple-900 md:hover:text-purple-600 md:hover:bg-transparent">
              <Link href="/problems">Problems</Link>
            </li>
            <li className="text-xl text-white py-2 hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
              <Link href="/to-do">To-Do</Link>
            </li>
            {isTeacher && (
              <li className="text-xl text-white py-2 hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
                <Link href="/submissions">Submissions</Link>
              </li>
            )}
            <li className="text-xl text-white py-2 hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
              <Link href="#projects">Discussion</Link>
            </li>
          </ul>
        </div>
        <div className="search-field hidden md:block">
          <form className="flex items-center h-100" action="#">
            <div className="input-group">
              <div className="input-group-prepend bg-transparent">
                <i className="input-group-text mdi mdi-magnify"></i>
              </div>
            </div>
          </form>
        </div>
        <div className="relative" style={{ display: 'flex' }}>
          <Link href="/class/join" legacyBehavior>
            <span className="text-2xl text-white p-5 hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent cursor-pointer">+</span>
          </Link>

          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center text-white focus:outline-none">
            <FaRegUserCircle className=" mr-1" />
            <span className="ml-2 mr-2">{data.name}</span>
            <FaCaretDown />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg py-1 z-20">
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
