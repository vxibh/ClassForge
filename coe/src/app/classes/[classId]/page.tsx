'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ClassInfoCard from '@/components/ClassInfoCard';
import PostList from '@/components/PostList';

interface Post {
  _id: string; // Assuming each post has an _id
  title: string;
  description: string;
  date: string; // Assuming the date is in ISO format '2024-06-20T00:00:00.000Z'
}

interface ClassData {
  title: string;
  description: string;
  posts: Post[];
}

const formatDate = (isoDate: string): string => {
  // Extract the date part before 'T'
  const datePart = isoDate.split('T')[0];
  return datePart;
};

const ClassPage = ({ params }: { params: { classId: string } }) => {
  const [activeItem, setActiveItem] = useState<string>('posts');
  const [classData, setClassData] = useState<ClassData | null>(null);
  const router = useRouter();
  const { classId } = params;

  const fetchClassData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/classes/${classId}`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data) {
        // Format dates in posts
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
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [classId, router]);

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handlePostClick = (postId: string) => {
    // Redirect to the post page with the postId
    router.push(`/classes/${classId}/posts/${postId}`);
  };

  if (!classData) {
    return <div>Loading...</div>; // You can add a loading indicator while fetching data
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <ClassInfoCard title={classData.title} description={classData.description} />
          {activeItem === 'posts' && <PostList posts={classData.posts} onPostClick={handlePostClick} />}
          {/* Add more conditional rendering based on `activeItem` if needed */}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
