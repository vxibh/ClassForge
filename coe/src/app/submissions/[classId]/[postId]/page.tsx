'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { ClimbingBoxLoader } from 'react-spinners';

interface Material {
  id: string;
  title: string;
  titleSlug: string;
  type: string;
  link: string;
  status: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  content: string; // Assuming content is part of the post
  date: string;
  dueDate: string;
  materials: Material[];
}
interface PostSubmission {
    _id: string; // Assuming MongoDB ObjectId
    postId: string; // ID of the post this submission belongs to
    userId: string; // ID of the user who made this submission
    createdAt: Date; // Date and time when the submission was created
    problemSubmissions: ProblemSubmission[]; // Array of problem submissions within this post submission
}
interface ProblemSubmission {
    _id: string; // Assuming MongoDB ObjectId
    problemId: string; // ID of the problem within the post
    userId: string; // ID of the user who submitted the solution
    submission: string; // The solution submitted by the user
    createdAt: Date; // Date and time when the problem submission was created
}
interface User {
  _id: string;
}

const formatDate = (isoDate: string | null): string => {
  if (!isoDate) return '';

  const datePart = new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return datePart;
};
interface UserDetail {
    _id: string;
    name: string;
  }
  
  
  
const PostPage = ({ params }: { params: { classId: string; postId: string } }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [className, setClassName] = useState<string>('');
  const [submissionStatus, setSubmissionStatus] = useState<string>('Assigned');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postSubmissions, setPostSubmissions] = useState<PostSubmission[]>([]); // Add state for problem submissions
  const [userDetails, setUserDetails] = useState<Record<string, UserDetail>>({});
  const router = useRouter();
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('User details fetched:', data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUser(null);
      }
    };

    const fetchPostData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(
          `http://localhost:5000/api/classes/${params.classId}/posts/${params.postId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }

        const postData: Post = await response.json();
        const formattedPost: Post = {
          ...postData,
          date: formatDate(postData.date),
          dueDate: formatDate(postData.dueDate),
        };

        setPost(formattedPost);
        setClassName(postData.className);
      } catch (error) {
        console.error('Error fetching post data:', error);
        setError('Failed to fetch post data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchPostData();
  }, [params.classId, params.postId]);

  useEffect(() => {
    const fetchPostSubmission = async () => {
      if (!user) return;
  
      try {
        const response = await fetch(`http://localhost:5000/api/postSubmissions/post/${params.postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch post submissions');
        }
  
        const data: PostSubmission[] = await response.json();
        setPostSubmissions(data);
  
        // Fetch user details for each submission
        const userIds = data.map(submission => submission.userId);
        const uniqueUserIds = Array.from(new Set(userIds));
  
        const userDetailsResponse = await Promise.all(
          uniqueUserIds.map(userId =>
            fetch(`http://localhost:5000/api/users/${userId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            }).then(res => res.json())
          )
        );
  
        const userDetailsMap: Record<string, UserDetail> = {};
        userDetailsResponse.forEach(user => {
          userDetailsMap[user._id] = user;
        });
  
        setUserDetails(userDetailsMap);
  
      } catch (error) {
        console.error('Error fetching post submissions:', error);
        setPostSubmissions([]);
      }
    };
  
    fetchPostSubmission();
  }, [user, params.postId]);

  console.log(postSubmissions)
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClimbingBoxLoader color="#4A90E2" size={20} />
      </div>
    );
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleSubmissionClick = (submissionId: string)=>{
    router.push(`/submissions/${params.classId}/${params.postId}/${submissionId}`)
  }

  const handleMenuItemClick = (itemId: string) => {};

  const isDueDatePassed = new Date(post.dueDate) < new Date();




  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: '56px' }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full">
            <h2 className="text-2xl font-bold mb-2">Submissions for {post.title}</h2>
            <p className="text-gray-700 mb-4">{post.date}</p>
            <p className="text-gray-700 mb-4">{post.description}</p>
            <div className="text-gray-700 mb-4">
              <strong>Due Date: </strong>
              {post.dueDate}
            </div>
            <div className="text-gray-700 mb-4">
              <strong>All submissions: </strong>
              <div className="grid grid-cols-1 gap-4">
                {postSubmissions.map((submission, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleSubmissionClick(submission._id)}>
                    <h3 className="text-xl font-semibold mb-2">
                      Post submission by {userDetails[submission.userId]?.name || 'Unknown User'}
                    </h3>
                    <div className="text-gray-700 mb-2">Date of submission: {new Date(submission.createdAt).toLocaleDateString()}</div>
                    <div className="text-gray-700">Number of problems solved: {submission.problemSubmissions.length}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default PostPage;
