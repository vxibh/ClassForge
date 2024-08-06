import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
interface SidebarProps {
  onItemClick: (item: string) => void;
}




const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const [activeItem, setActiveItem] = useState<string>('');
  const [enrolledDropdownOpen, setEnrolledDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [data, setData] = useState<{ name: string }>({ name: '' });
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'enrolled', name: 'Enrolled' },
    { id: 'problems', name: 'Problems' },
    { id: 'to-do', name: 'To-Do' },
    ...(isTeacher ? [{ id: 'submissions', name: 'Submissions' }] : []),
    { id: 'discussions', name: 'Discussions' },
    { id: 'leaderboard', name: 'Leaderboard' },
    { id: 'profile', name: 'Profile' },
    { id: 'resources', name: 'Resources' }
  ];

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

  const enrolledClasses = [
    { id: 'class1', name: 'Class 1' },
    { id: 'class2', name: 'Class 2' },
    { id: 'class3', name: 'Class 3' }
    // Add more classes as needed
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    onItemClick(itemId);

    switch (itemId) {
      case 'problems':
        router.push('/problems');
        break;
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'enrolled':
        router.push('/enrolled');
        break;  
      case 'to-do':
        router.push('/to-do');
        break;
      case 'submissions':
        router.push('/submissions');
        break;   
      case 'profile':
        router.push('/profile');
        break;   
      // Add more cases as needed
      default:
        break;
    }
  };

  const toggleEnrolledDropdown = () => {
    setEnrolledDropdownOpen(!enrolledDropdownOpen);
  };

  console.log(activeItem)
  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col">
      <ul className="flex flex-col p-4">
        {menuItems.map(item => (
          <li
            key={item.id}
            className={`py-2 px-4 my-1 rounded cursor-pointer ${item.id === activeItem ? 'bg-green-500 font-bold' : 'hover:bg-gray-600'}`}
            onClick={() => handleItemClick(item.id)}
          >
            {item.name}
          </li>
        ))}
        
      </ul>
    </div>
  );
}

export default Sidebar;