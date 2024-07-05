// src/app/classes/[classId]/posts/[postId]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import YourWorkBox from './YourWorkBox';

interface Material {
  type: string;
  link: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  dueDate: string;
  materials: Material[];
}

interface ClassData {
  title: string;
  description: string;
  posts: Post[];
}

const classData: Record<string, ClassData> = {
  class1: {
    title: 'Introduction to Algorithms',
    description: 'Learn the basics of algorithms and data structures.',
    posts: [
      {
        id: 'p1',
        title: 'Assignment 1',
        description: 'Solve algorithm problems.',
        content: 'Detailed content of Assignment 1',
        date: '2024-06-20',
        dueDate: '2024-07-01',
        materials: [{ type: 'PDF', link: '/path/to/assignment1.pdf' },{ type: 'WORD', link: '/path/to/assignment1.docx' }],
      },
      {
        id: 'p2',
        title: 'Study Material',
        description: 'Read the provided notes on algorithms.',
        content: 'Detailed content of Study Material',
        date: '2024-06-21',
        dueDate: '',
        materials: [{ type: 'PDF', link: '/path/to/study-material.pdf' }],
      },
    ],
  },
  class2: {
    title: 'Advanced Machine Learning',
    description: 'Dive deep into machine learning algorithms and techniques.',
    posts: [
      {
        id: 'p1',
        title: 'Project Proposal',
        description: 'Submit project proposal.',
        content: 'Detailed content of Project Proposal',
        date: '2024-06-18',
        dueDate: '2024-07-05',
        materials: [{ type: 'Doc', link: '/path/to/project-proposal.docx' }],
      },
      {
        id: 'p2',
        title: 'Homework 1',
        description: 'Implement a machine learning algorithm.',
        content: 'Detailed content of Homework 1',
        date: '2024-06-20',
        dueDate: '2024-07-10',
        materials: [{ type: 'PDF', link: '/path/to/homework1.pdf' }],
      },
    ],
  },
  class3: {
    title: 'Web Development Bootcamp',
    description: 'Build modern web applications using the latest technologies.',
    posts: [
      {
        id: 'p1',
        title: 'Build a Website',
        description: 'Create a personal portfolio website.',
        content: 'Detailed content of Build a Website',
        date: '2024-06-15',
        dueDate: '2024-07-15',
        materials: [{ type: 'PDF', link: '/path/to/build-a-website.pdf' }],
      },
      {
        id: 'p2',
        title: 'React Project',
        description: 'Develop a project using React.',
        content: 'Detailed content of React Project',
        date: '2024-06-19',
        dueDate: '2024-07-20',
        materials: [{ type: 'PDF', link: '/path/to/react-project.pdf' }],
      },
    ],
  },
};

const PostPage = ({ params }: { params: { classId: string, postId: string } }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [className, setClassName] = useState<string>('');
  const router = useRouter();
  const { classId, postId } = params;

  useEffect(() => {
    const classInfo = classData[classId as keyof typeof classData];
    if (classInfo) {
      const postInfo = classInfo.posts.find(post => post.id === postId);
      if (postInfo) {
        setPost(postInfo);
        setClassName(classInfo.title);
      } else {
        router.push(`/classes/${classId}`);
      }
    } else {
      router.push('/enrolled-classes');
    }
  }, [classId, postId, router]);

  if (!post) {
    return null;
  }

  const handleMenuItemClick = (itemId: string) => {};

  const isDueDatePassed = new Date(post.dueDate) < new Date();

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '/icons/pdf.svg';
      case 'word':
        return '/icons/word.svg';
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto flex">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-2/3 mr-4">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4">{post.date}</p>
            <p className="text-gray-700 mb-4">{post.description}</p>
            <div className="text-gray-700 mb-4">
              <strong>Due Date: </strong>{post.dueDate}
            </div>
            <div className="text-gray-700 mb-4">
              <strong>Materials: </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {post.materials.map((material, index) => (
                  <a href={material.link} target="_blank" key={index} className="block bg-gray-200 rounded-lg p-4 shadow-md hover:bg-gray-300">
                    <div className="flex items-center mb-2">
                      <img src={getIcon(material.type)} alt={material.type} className="w-8 h-8 mr-2" />
                      <span className="text-lg font-semibold">{material.type.toUpperCase()}</span>
                    </div>
                    <p className="text-gray-700">{material.link.split('/').pop()}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <YourWorkBox isDueDatePassed={isDueDatePassed} />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
