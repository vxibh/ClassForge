'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { HashLoader } from 'react-spinners';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [postSubmissions, setPostSubmissions] = useState([]);
  const [problemSubmissions, setProblemSubmissions] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you're storing JWT in localStorage
        const response = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
        await fetchEnrolledClasses(data.enrolledClasses)
        await fetchPostSubmissions(data.postSubmissions);
        await fetchProblemSubmissions(data.problemSubmissions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrolledClasses = async (enrolledClassesIds) => {
      try {
        const token = localStorage.getItem('token');
        const enrolledClassesData = await Promise.all(enrolledClassesIds.map(async (id) => {
          const response = await fetch(`http://localhost:5000/api/classes/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch class with id ${id}`);
          }
          return await response.json();
        }));
        setEnrolledClasses(enrolledClassesData);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchPostSubmissions = async (postSubmissionIds) => {
      try {
        const postSubmissionsData = await Promise.all(postSubmissionIds.map(async (id) => {
          const response = await fetch(`http://localhost:5000/api/postSubmissions/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch post submission with id ${id}`);
          }
          const postSubmission = await response.json();
          const postResponse = await fetch(`http://localhost:5000/api/classes/posts/${postSubmission.postId}`);
          if (!postResponse.ok) {
            throw new Error(`Failed to fetch post with id ${postSubmission.postId}`);
          }
          const post = await postResponse.json();
          return { ...postSubmission, postTitle: post.title };
        }));
        setPostSubmissions(postSubmissionsData);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchProblemSubmissions = async (problemSubmissionIds) => {
      try {
        const problemSubmissionsData = await Promise.all(problemSubmissionIds.map(async (id) => {
          const response = await fetch(`http://localhost:5000/api/problemSubmission/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch problem submission with id ${id}`);
          }
          return await response.json();
        }));
        setProblemSubmissions(problemSubmissionsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#fc03c2" loading={loading} size={40} aria-label="Loading Spinner" data-testid="loader" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleMenuItemClick = (itemId) => {
    // Implement logic to change content based on the clicked menu item if needed
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: "56px" }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 bg-gray-100 overflow-y-auto border p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg animate-fade-in p-7">
            <div className="flex items-center space-x-4 mb-8 border-b pb-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </div>

            <div className="mb-8 border-b pb-4">
              <h2 className="text-2xl font-semibold mb-2">Profile Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Batch</p>
                  <p>{user.batch}</p>
                </div>
                <div>
                  <p className="text-gray-600">Role</p>
                  <p>{user.isTeacher ? 'Teacher' : 'Student'}</p>
                </div>
              </div>
            </div>

            <div className="mb-8 border-b pb-4">
              <h2 className="text-2xl font-semibold mb-2">Enrolled Classes</h2>
              <ul className="list-disc pl-5">
                {enrolledClasses.map((classItem) => (
                  <li key={classItem}>{classItem.title}</li>
                ))}
              </ul>
            </div>

            <div className="mb-8 border-b pb-4">
              <h2 className="text-2xl font-semibold mb-2">Post Submissions</h2>
              <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: "#d3d3d357" }}>
                <ul className="list-disc pl-5">
                  {postSubmissions.map((post) => (
                    <li key={post._id} className="mb-2">
                      {post.postTitle}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">Problem Submissions</h2>
              <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: "#d3d3d357" }}>
                <ul className="list-disc pl-5">
                  {problemSubmissions.map((problem) => (
                    <li key={problem._id} className="mb-2">
                      {problem.problemId}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
