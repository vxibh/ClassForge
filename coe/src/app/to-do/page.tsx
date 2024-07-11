'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const ToDoPage = () => {
  const [posts, setPosts] = useState([]);
  const [activeItem, setActiveItem] = useState<string>('to-do');
  const router = useRouter();

  useEffect(() => {
    const fetchDuePosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/to-do/due', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error('Failed to fetch due posts');
        }
      } catch (error) {
        console.error('Error fetching due posts:', error);
      }
    };

    fetchDuePosts();
  }, []);

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
    // Implement routing based on itemId if needed
  };

  const handlePostClick = (postId, classId) => {
    router.push(`/classes/${classId}/posts/${postId}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">To-do</h2>
          <div className="grid grid-cols-1 gap-4">
            {posts.map(post => (
              <div
                key={post.postId}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => handlePostClick(post.postId, post.classId)}
              >
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-700">{post.classTitle}</p>
                <p className="text-gray-500 text-sm">Due Date: {post.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoPage;
