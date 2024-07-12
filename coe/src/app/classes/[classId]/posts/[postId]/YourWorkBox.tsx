import React, { useState } from 'react';
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
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      setSubmissionStatus('Submitted');
      alert(`Submitting file: ${file.name}`);
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
      <input type="file" onChange={handleFileChange} className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md" />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 mb-4 w-full"
      >
        Submit
      </button>
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
