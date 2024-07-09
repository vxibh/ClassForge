'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ClassInfoCard from '@/components/ClassInfoCard';
import PostList from '@/components/PostList';

interface Post {
  _id: string;
  title: string;
  description: string;
  date: string;
  content: string;
  dueDate: string;
  materials: string[];
}

interface ClassData {
  title: string;
  description: string;
  posts: Post[];
  code: string;
}

const formatDate = (isoDate: string): string => {
  const datePart = isoDate.split('T')[0];
  return datePart;
};

const ClassPage = ({ params }: { params: { classId: string } }) => {
  const [activeItem, setActiveItem] = useState<string>('posts');
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const router = useRouter();
  const { classId } = params;

  const fetchClassData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/classes/${classId}`, {
        method: 'GET',
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
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [classId, router]);

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handlePostClick = (postId: string) => {
    router.push(`/classes/${classId}/posts/${postId}`);
  };

  const handlePostDelete = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/classes/${classId}/posts/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Update state immutably
        setClassData(prevData => ({
          ...prevData,
          posts: prevData.posts.filter(post => post._id !== postId),
        }));
      } else {
        const errorData = await response.json();
        console.error('Error deleting post:', errorData);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const [newPost, setNewPost] = useState({ title: '', description: '', content: '', date: '', dueDate: '', materials: [] });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();

    const postData = {
      ...newPost,
      date: currentDate,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/classes/${classId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        setNewPost({ title: '', description: '', content: '', date: '', dueDate: '', materials: [] });
        setShowPostForm(false);
        fetchClassData();  // Re-fetch the class data to ensure the new post is displayed correctly
      } else {
        const errorData = await response.json();
        console.error('Error creating post:', errorData);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (!classData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <ClassInfoCard
            title={classData.title}
            description={classData.description}
            code={classData.code}
          />
          {activeItem === 'posts' && (
            <>
              <button
                onClick={() => setShowPostForm(!showPostForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
              >
                {showPostForm ? 'Cancel' : 'Add Post'}
              </button>
              {showPostForm && (
                <form onSubmit={handlePostSubmit} className="mb-4">
                  <div className="mb-2">
                    <label className="block text-sm font-bold mb-2" htmlFor="title">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newPost.title}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-bold mb-2" htmlFor="description">Description</label>
                    <textarea
                      name="description"
                      value={newPost.description}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-bold mb-2" htmlFor="content">Content</label>
                    <input
                      type="text"
                      name="content"
                      value={newPost.content}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-bold mb-2" htmlFor="date">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={newPost.date}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-bold mb-2" htmlFor="dueDate">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={newPost.dueDate}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-bold mb-2" htmlFor="materials">Materials</label>
                    <input
                      type="text"
                      name="materials"
                      value={newPost.materials.join(',')}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Submit
                  </button>
                </form>
              )}
              <PostList posts={classData.posts} onPostClick={handlePostClick} onDeleteClick={handlePostDelete} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
