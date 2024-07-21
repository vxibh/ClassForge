'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ClassInfoCard from '@/components/ClassInfoCard';
import PostList from '@/components/PostList';
import { Post, ClassData, User } from '@/types'; // Import types as needed
import { HashLoader } from 'react-spinners';

const formatDate = (isoDate: string): string => {
  const datePart = isoDate.split('T')[0];
  return datePart;
};

const ClassPage = ({ params }: { params: { classId: string } }) => {
  const [activeItem, setActiveItem] = useState<string>('posts');
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [showProblemSetOverlay, setShowProblemSetOverlay] = useState<boolean>(false);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [newPost, setNewPost] = useState<Post>({
    _id: '',
    title: '',
    description: '',
    date: '',
    content: '',
    dueDate: '',
    materials: [],
  });

  const router = useRouter();
  const { classId } = params;

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/classes/${classId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data) {
        const formattedPosts = data.posts.map((post: Post) => ({
          ...post,
          date: formatDate(post.date),
        }));
        setClassData({ ...data, posts: formattedPosts });
      } else {
          router.push('/enrolled');
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
        router.push('/enrolled');
    } finally {
      // Simulate additional loading time
      setTimeout(() => {
        setLoading(false);
      }, 2000); // Adjust the delay time as needed
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data: User = await response.json();
      setIsTeacher(data.isTeacher);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handlePostClick = (postId: string) => {
    setLoading(true);
    setTimeout(() => {
      router.push(`/submissions/${classId}/${postId}`)
    }, 1500)
  };

  const handlePostDelete = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/classes/${classId}/posts/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setClassData((prevData) => ({
          ...prevData,
          posts: prevData.posts.filter((post) => post._id !== postId),
        }));
      } else {
        const errorData = await response.json();
        console.error('Error deleting post:', errorData);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    fetchClassData();
    fetchUserData();
  }, [classId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#fc03c2" size={40} aria-label="Loading Spinner" />
      </div>
    );
  }

  if (!classData) {
    return <div className="flex justify-center items-center h-screen">No class data available</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: '56px' }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <ClassInfoCard
            title={classData.title}
            description={classData.description}
            code={classData.code}
          />
          {activeItem === 'posts' && (
            <PostList
              posts={classData.posts}
              onPostClick={handlePostClick}
              onDelete={handlePostDelete}
              isTeacher={isTeacher}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
