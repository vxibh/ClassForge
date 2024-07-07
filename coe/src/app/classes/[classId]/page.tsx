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
  date: string; // Assuming the date is in ISO format '2024-06-20T00:00:00.000Z'
}

interface ClassData {
  title: string;
  description: string;
  posts: Post[];
  code: string; // Add code property to ClassData interface
}

const formatDate = (isoDate: string): string => {
  // Extract the date part before 'T'
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

  const [newPost, setNewPost] = useState({ title: '', description: '', content: '', date: '' });

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
        const createdPost = await response.json();
  
        // Update state immutably
        setClassData(prevData => ({
          ...prevData,
          posts: [...prevData.posts, createdPost], // Ensure immutability
        }));
  
        setNewPost({ title: '', description: '', content: '', date: '' });
        setShowPostForm(false);
      } else {
        const errorData = await response.json();
        console.error('Error creating post:', errorData);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
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
          <ClassInfoCard
            title={classData.title}
            description={classData.description}
            code={classData.code} // Pass the class code to ClassInfoCard
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
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Submit
                  </button>
                </form>
              )}
              <PostList posts={classData.posts} onPostClick={handlePostClick} />
            </>
          )}
          {/* Add more conditional rendering based on `activeItem` if needed */}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
