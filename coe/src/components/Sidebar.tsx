import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const [activeItem, setActiveItem] = useState<string>('');
  const [enrolledDropdownOpen, setEnrolledDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'enrolled', name: 'Enrolled' },
    { id: 'problems', name: 'Problems' },
    { id: 'to-do', name: 'To-Do' },
    { id: 'submissions', name: 'Submissions' },
    { id: 'discussions', name: 'Discussions' },
    { id: 'leaderboard', name: 'Leaderboard' },
    { id: 'profile', name: 'Profile' },
    { id: 'resources', name: 'Resources' }
  ];

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
};

export default Sidebar;
