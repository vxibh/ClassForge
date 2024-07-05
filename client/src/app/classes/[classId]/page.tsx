
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ClassInfoCard from '@/components/ClassInfoCard';
import PostList from '@/components/PostList';

interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface ClassData {
  [key: string]: {
    title: string;
    description: string;
    posts: Post[];
  };
}

const classData: ClassData = {
  class1: {
    title: 'Introduction to Algorithms',
    description: 'Learn the basics of algorithms and data structures.',
    posts: [
      { id: 'p1', title: 'Assignment 1', description: 'Solve algorithm problems.', date: '2024-06-20' },
      { id: 'p2', title: 'Study Material', description: 'Read the provided notes on algorithms.', date: '2024-06-21' },
    ],
  },
  class2: {
    title: 'Advanced Machine Learning',
    description: 'Dive deep into machine learning algorithms and techniques.',
    posts: [
      { id: 'p1', title: 'Project Proposal', description: 'Submit project proposal.', date: '2024-06-18' },
      { id: 'p2', title: 'Homework 1', description: 'Implement a machine learning algorithm.', date: '2024-06-20' },
    ],
  },
  class3: {
    title: 'Web Development Bootcamp',
    description: 'Build modern web applications using the latest technologies.',
    posts: [
      { id: 'p1', title: 'Build a Website', description: 'Create a personal portfolio website.', date: '2024-06-15' },
      { id: 'p2', title: 'React Project', description: 'Develop a project using React.', date: '2024-06-19' },
    ],
  },
};

const ClassPage = ({ params }: { params: { classId: string } }) => {
  const [activeItem, setActiveItem] = useState<string>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [className, setClassName] = useState<string>('');
  const [classDescription, setClassDescription] = useState<string>('');
  const router = useRouter();
  const { classId } = params;

  useEffect(() => {
    const classInfo = classData[classId as keyof typeof classData];
    if (classInfo) {
      setClassName(classInfo.title);
      setClassDescription(classInfo.description);
      setPosts(classInfo.posts);
    } else {
      router.push('/enrolled-classes');
    }
  }, [classId, router]);

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handlePostClick = (postId: string) => {
    router.push(`/classes/${classId}/posts/${postId}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <ClassInfoCard title={className} description={classDescription} />
          {activeItem === 'posts' && <PostList posts={posts} onPostClick={handlePostClick} />}
          {/* Add more conditional rendering based on `activeItem` if needed */}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
