import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface YourWorkBoxProps {
  isDueDatePassed: boolean;
  submissionStatus: string;
  setSubmissionStatus: (status: string) => void;
  classId: string;
  postId: string;
}

const YourWorkBox: React.FC<YourWorkBoxProps> = ({ isDueDatePassed, submissionStatus, setSubmissionStatus, classId, postId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<string | null>(null); // To store existing submission details
  const router = useRouter();

  useEffect(() => {
    // Fetch the existing submission if any
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/postsubmissions/${classId}/${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const submission = await response.json();
          setExistingSubmission(submission.fileName); // Assuming submission contains fileName
          setSubmissionStatus('Submitted');
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };

    fetchSubmission();
  }, [classId, postId, setSubmissionStatus]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`http://localhost:5000/api/postsubmissions/${classId}/${postId}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setSubmissionStatus('Submitted');
          alert(`File submitted successfully: ${file.name}`);
        } else {
          alert('Failed to submit file');
        }
      } catch (error) {
        console.error('Error submitting file:', error);
        alert('An error occurred while submitting the file');
      }
    }
  };

  const handleOpenInEditor = () => {
    router.push(`/problems?classId=${classId}&postId=${postId}`); // Navigate to the problems page with query parameters
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 ml-6" style={{ width: "30%", height: "fit-content" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Your Work</h3>
        <p className={submissionStatus === 'Submitted' ? "text-green-500" : isDueDatePassed ? "text-red-500" : "text-green-500"}>
          {submissionStatus === 'Submitted' ? "Submitted" : isDueDatePassed ? "Missing" : "Assigned"}
        </p>
      </div>
      {existingSubmission ? (
        <p className="text-gray-700 mb-4">Submitted file: {existingSubmission}</p>
      ) : (
        <>
          <input type="file" onChange={handleFileChange} className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md" />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 mb-4 w-full"
            disabled={isDueDatePassed || submissionStatus === 'Submitted'}
          >
            Submit
          </button>
        </>
      )}
      <button
        onClick={handleOpenInEditor}
        className="bg-green-500 text-white rounded-lg px-4 py-2 mb-4 w-full"
      >
        Open in Editor
      </button>
    </div>
  );
};

export default YourWorkBox;
