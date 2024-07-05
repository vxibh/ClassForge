import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal'; // Assuming you're using Bootstrap for styling

const CourseDetailsOverlay = ({ courseId, onClose }: { courseId: string, onClose: () => void }) => {
  const [courseDetails, setCourseDetails] = useState<{ name: string, description: string, announcements: { id: string, title: string, content: string }[], people: { id: string, name: string, role: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch course details when component mounts
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      // Replace with actual API endpoint to fetch course details
      const response = await fetch(`http://localhost:3000/courses/${courseId}/announcements`);
      const data = await response.json();
      if (data.success) {
        setCourseDetails(data.courseDetails);
      } else {
        console.error('Failed to fetch course details:', data.error);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setLoading(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Course Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Loading course details...</p>
        ) : courseDetails ? (
          <>
            <h2>{courseDetails.name}</h2>
            <p>Description: {courseDetails.description}</p>
            <h3>Announcements:</h3>
            <ul>
              {courseDetails.announcements.map((announcement) => (
                <li key={announcement.id}>
                  <strong>{announcement.title}</strong>
                  <p>{announcement.content}</p>
                </li>
              ))}
            </ul>
            <h3>People in Course:</h3>
            <ul>
              {courseDetails.people.map((person) => (
                <li key={person.id}>
                  {person.name} - {person.role}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Failed to load course details.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

CourseDetailsOverlay.propTypes = {
  courseId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CourseDetailsOverlay;
