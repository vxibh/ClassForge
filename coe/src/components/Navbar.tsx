// components/Navbar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { FaRegUserCircle, FaCaretDown } from 'react-icons/fa';
import LogoutButton from './LogoutButton'; // Adjust the import path as necessary

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="w-full h-16 bg-gray-700 fixed top-0 left-0 right-0 bottom-5">
      <div className="flex justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div className="flex items-center" style={{ marginTop: '4px' }}>
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
            <li className="text-xl text-white py-2 hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
              <Link href="#contact">Submissions</Link>
            </li>
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
              <input
                type="text"
                className="form-control"
                style={{ borderRadius: '4px', width: '22rem', textAlign: 'center', color: 'white', backgroundColor: '#393838' }}
                placeholder="Search problems"
              />
            </div>
          </form>
        </div>
        <div className="relative" style={{display:"flex"}}>
          
        <Link href="/class/join" legacyBehavior>
        <span className="text-2xl text-white p-5 hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent cursor-pointer">+</span></Link>


          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center text-white focus:outline-none">
            <FaRegUserCircle className="mt-1 mr-1" />
            <span className="mt-1">User</span>
            <FaCaretDown />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 mr-1 w-20 bg-white rounded-md shadow-lg py-1 z-20">
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
