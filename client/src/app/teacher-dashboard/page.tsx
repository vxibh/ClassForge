// TeacherDashboard.tsx
'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import LogoutButton from '@/components/LogoutButton';
import { UserButton } from '@clerk/nextjs';
import CreateClassroomForm from '@/components/CreateClassroomForm';
import CourseDetailsComponent from '@/components/CourseDetailsComponent'; // Adjust path as necessary
import CourseDetailsOverlay from '@/components/CourseDetailsOverlay';

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateClassroomForm, setShowCreateClassroomForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState(null); // State to manage selected course


  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/');
      } else if (user.publicMetadata.role !== 'teacher') {
        signOut().then(() => {
          router.push('/');
        });
      } else {
        fetchCourses();
      }
    }
  }, [isLoaded, isSignedIn, user, router, signOut]);

  const fetchCourses = () => {
    fetch('http://localhost:3000/list-courses')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCourses(data.courses);
        } else {
          console.error('Failed to fetch courses:', data.error);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });
  };

  const handleCreateClassroom = async (formData) => {
    try {
      const response = await fetch('http://localhost:3000/create-classroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        console.log('Classroom created successfully:', data.classroom);
        fetchCourses();
        setShowCreateClassroomForm(false);
      } else {
        console.error('Failed to create classroom:', data.error);
      }
    } catch (error) {
      console.error('Error creating classroom:', error);
    }
  };

  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:3000/delete-course/${courseId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        console.log('Course deleted successfully:', courseId);
        fetchCourses();
        if (selectedCourseId === courseId) {
          setSelectedCourseId(null);
        }
      } else {
        console.error('Failed to delete course:', data.error);
        alert(`Failed to delete course: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(`Error deleting course: ${error.message}`);
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const toggleCreateClassroomForm = () => {
    setShowCreateClassroomForm(!showCreateClassroomForm);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="flex justify-between items-center mb-6 p-4 bg-indigo-600 text-white shadow-lg rounded-lg">
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
            onClick={() => handleNavigation('/create-assignment')}
          >
            Create New Assignment
          </button>
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
            onClick={() => handleNavigation('/question-bank')}
          >
            Question Bank 
          </button>
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
            onClick={() => handleNavigation('/view-submissions')}
          >
            View Submissions
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <UserButton />
          <LogoutButton className="bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out text-white px-4 py-2 rounded shadow-md" />
        </div>
      </nav>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome Teacher</h1>
        <p className="text-gray-600">Manage your assignments, question bank, and view submissions easily from this dashboard.</p>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id}>
                <div
                  onClick={() => handleCourseClick(course.id)}
                  className="cursor-pointer p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                >
                  <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                  <p className="text-gray-600">Course ID: {course.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectedCourseId && (
          <div className="mt-6">
            <CourseDetailsComponent courseId={selectedCourseId} />
          </div>
        )}
        <div className="mt-6">
          <button
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition duration-300 ease-in-out shadow-md"
            onClick={toggleCreateClassroomForm}
          >
            {showCreateClassroomForm ? 'Cancel' : 'Create Classroom'}
          </button>
          {showCreateClassroomForm && (
            <div className="mt-4">
              <h2 className="text-2xl font-bold mb-4">Create Classroom</h2>
              <CreateClassroomForm onCreateClassroom={handleCreateClassroom} />
            </div>
          )}
        </div>
      </div>
      {selectedCourse && (
        <CourseDetailsOverlay
          courseId={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
