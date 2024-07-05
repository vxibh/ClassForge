// CourseDetailsComponent.tsx

import { useState, useEffect } from 'react';

interface CourseDetailsProps {
  courseId: string;
}

const CourseDetailsComponent: React.FC<CourseDetailsProps> = ({ courseId }) => {
  const [courseDetails, setCourseDetails] = useState<any>(null); // Replace 'any' with actual type of course details

  useEffect(() => {
    // Fetch course details based on courseId
    fetchCourseDetails(courseId);
  }, [courseId]);

  const fetchCourseDetails = async (courseId: string) => {
    try {
      // Replace with actual API endpoint to fetch course details
      const response = await fetch(`http://localhost:3000/get-course-details/${courseId}`);
      const data = await response.json();
      if (data.success) {
        setCourseDetails(data.course); // Set course details to state
      } else {
        console.error('Failed to fetch course details:', data.error);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  if (!courseDetails) {
    return <div>Loading course details...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">{courseDetails.name}</h3>
      <p className="text-gray-600 mb-4">Course ID: {courseDetails.id}</p>
      
      {/* Example: Displaying announcements */}
      <div className="mb-4">
        <h4 className="text-lg font-bold mb-2">Announcements</h4>
        <ul className="list-disc pl-4">
          {courseDetails.announcements.map((announcement: any, index: number) => (
            <li key={index}>{announcement.title}: {announcement.content}</li>
          ))}
        </ul>
      </div>
      
      {/* Example: Displaying people in the course */}
      <div className="mb-4">
        <h4 className="text-lg font-bold mb-2">People in Course</h4>
        <ul className="list-disc pl-4">
          {courseDetails.people.map((person: any, index: number) => (
            <li key={index}>{person.name} ({person.role})</li>
          ))}
        </ul>
      </div>

      {/* Add more details as needed */}
    </div>
  );
};

export default CourseDetailsComponent;
