'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ClassInfoCard from '@/components/ClassInfoCard';
import PostList from '@/components/PostList';
import ProblemSetOverlay from '@/components/ProblemSetOverlay';
import AddPostForm from '@/components/AddPostForm';
import { Post, ClassData, User, Problem } from '@/types';
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
  const [loading, setLoading] = useState(false);
  const [showProblemSetOverlay, setShowProblemSetOverlay] = useState<boolean>(false);
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
    setLoading(true);
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
        setTimeout(() => {
          router.push('/enrolled');
        }, 2500); // Delay for 1 second
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
      router.push('/enrolled');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
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
    } finally {
      
      setLoading(false);
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handlePostClick = (postId: string) => {
    setTimeout(() => {
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-50 bg-opacity-75 z-50">
          <div className="sweet-loading">
            <HashLoader
              color="#fc03c2"
              loading={loading}
              size={40}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>
      )}
      router.push(`/classes/${classId}/posts/${postId}`);
    }, 2000); 
    
  };

  const handleCloseForm = () => {
    setShowAddPostForm(false);
  };

  const handlePostDelete = async (postId: string) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProblems = (selectedProblems: Problem[]) => {
    setNewPost((prevPost) => ({
      ...prevPost,
      materials: [...prevPost.materials, ...selectedProblems],
    }));
  };

  const handlePostFormSubmit = async (postData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('description', postData.description);
      formData.append('content', postData.content);
      formData.append('date', postData.date);
      formData.append('dueDate', postData.dueDate);

      if (postData.file) {
        formData.append('file', postData.file);
      }

      formData.append('materials', JSON.stringify(postData.materials));

      const response = await fetch(`http://localhost:5000/api/classes/${classId}/posts`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setNewPost({
          _id: '',
          title: '',
          description: '',
          date: '',
          content: '',
          dueDate: '',
          materials: [],
        });
        setShowAddPostForm(false);
        fetchClassData();
      } else {
        const errorData = await response.json();
        console.error('Error creating post:', errorData);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
    fetchUserData();
  }, [classId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#fc03c2" loading={loading} size={40} aria-label="Loading Spinner" data-testid="loader" />
      </div>
    );
  }

  if (!classData) {
    return <div>Loading...</div>;
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
            <>
              {isTeacher && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowAddPostForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                  >
                    Add Post
                  </button>
                </div>
              )}
              <PostList
                posts={classData.posts}
                onPostClick={handlePostClick}
                onDelete={handlePostDelete}
                isTeacher={isTeacher}
              />
              {showAddPostForm && (
                <AddPostForm
                  onSubmit={handlePostFormSubmit}
                  onClose={() => setShowAddPostForm(false)}
                  onSelectProblems={handleSelectProblems}
                />
              )}
            </>
          )}
        </div>
      </div>
      {showProblemSetOverlay && (
        <ProblemSetOverlay
          onClose={() => setShowProblemSetOverlay(false)}
          onSelectProblems={handleSelectProblems}
        />
      )}
    </div>
  );
};

export default ClassPage;
