'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { FaRegUserCircle } from "react-icons/fa";
import { FaCaretDown } from 'react-icons/fa';
import LogoutButton from '@/components/LogoutButton';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/'); // Redirect to home if not signed in
      } else if (user.publicMetadata.role !== 'student') {
        signOut().then(() => {
          router.push('/'); // Redirect to home if not a student and log out
        });
      }
    }
  }, [isLoaded, isSignedIn, user, router, signOut]);

  if (!isLoaded) {
    return <div className="spinner-border" role="status"> <span className="sr-only"> Loading... </span> </div>; // Optionally render a loading indicator here
  }

  return (
    <div>
      <nav className="w-full h-14 bg-black fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div className="flex items-center" style={{ marginTop: "4px" }}>
            <Link href="/">
              <h2 className="text-2xl text-cyan-600 font-bold ">LOGO</h2>
            </Link>
            <ul className="flex items-center ml-10 space-x-6">
              <li className="text-xl text-white py-2 hover:bg-purple-900 md:hover:text-purple-600 md:hover:bg-transparent">
                <Link href="#about">Problems</Link>
              </li>
              <li className="text-xl text-white py-2 hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
                <Link href="#blog">To-Do</Link>
              </li>
              <li className="text-xl text-white py-2 hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
                <Link href="#contact">Submissions</Link>
              </li>
              <li className="text-xl text-white py-2 hover:bg-purple-600 md:hover:text-purple-600 md:hover:bg-transparent">
                <Link href="#projects">Community</Link>
              </li>
            </ul>
          </div>
          <div className="search-field d-none d-md-block">
            <form className="d-flex align-items-center h-100" action="#">
              <div className="input-group">
                <div className="input-group-prepend bg-transparent">
                  <i className="input-group-text mdi mdi-magnify"></i>
                </div>
                <input type="text" className="form-control" style={{borderRadius:"4px",width:"22rem",textAlign:"center",color:"white",backgroundColor:"#393838"}} placeholder="Search problems" />
              </div>
            </form>
          </div>
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center text-white focus:outline-none">
              <FaRegUserCircle className="mr-1" />
              <span className="mr-1">User</span>
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
    </div>
  );
}
