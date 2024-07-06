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

const formatDate = (isoDate: string): string => {
  // Extract the date part before 'T'
  const datePart = isoDate.split('T')[0];
  return datePart;
};

const PostPage = ({ params }: { params: { classId: string, postId: string } }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [className, setClassName] = useState<string>('');
  const router = useRouter();
  const { classId, postId } = params;

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/classes/${classId}/posts/${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any authentication headers if required
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }

        const postData = await response.json();

        // Format dates in the fetched post data
        const formattedPost: Post = {
          ...postData,
          date: formatDate(postData.date),
          dueDate: formatDate(postData.dueDate),
        };

        setPost(formattedPost);
        setClassName(postData.className); // Assuming you also fetch class name from backend
      } catch (error) {
        console.error('Error fetching post data:', error);
        router.push(`/classes/${classId}`);
      }
    };

    if (classId && postId) {
      fetchPostData();
    } else {
      console.warn('classId or postId is undefined');
    }
  }, [classId, postId, router]);

  if (!post) {
    return <div>Loading...</div>; // You can render a loading indicator or handle the absence of post data as needed
  }

  const handleMenuItemClick = (itemId: string) => {};

  const isDueDatePassed = new Date(post.dueDate) < new Date();

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '/icons/pdf.svg';
      case 'word':
        return '/icons/word.svg';
      default:
        return '/icons/default.svg';
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
