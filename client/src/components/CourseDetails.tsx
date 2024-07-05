// CourseDetails.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface CourseDetailsProps {
  courseId: string;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId }) => {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null); // Adjust the type as per your API response

  useEffect(() => {
    // Fetch course details based on courseId
    fetchCourseDetails(courseId);
  }, [courseId]);

  const fetchCourseDetails = async (courseId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/get-course-details/${courseId}`); // Adjust API endpoint
      const data = await response.json();
      if (data.success) {
        setCourse(data.course);
      } else {
        console.error('Failed to fetch course details:', data.error);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  if (!course) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{course.name}</h1>
      <p className="text-gray-600">Course ID: {course.id}</p>
      <p className="text-gray-600">Description: {course.description}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default CourseDetails;
