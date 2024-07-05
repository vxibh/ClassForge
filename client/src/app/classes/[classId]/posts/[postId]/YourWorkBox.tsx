// src/app/classes/[classId]/posts/[postId]/YourWorkBox.tsx
import React, { useState } from 'react';

interface YourWorkBoxProps {
  isDueDatePassed: boolean;
}

const YourWorkBox: React.FC<YourWorkBoxProps> = ({ isDueDatePassed }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      // Handle file submission logic here
      alert(`Submitting file: ${file.name}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 ml-6" style={{ width: "30%", height: "fit-content" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Your Work</h3>
        <p className={isDueDatePassed ? "text-red-500" : "text-green-500"}>
          {isDueDatePassed ? "Missing" : "Assigned"}
        </p>
      </div>
      <input type="file" onChange={handleFileChange} className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md" />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 mb-4 w-full"
      >
        Submit
      </button>
    </div>
  );
};

export default YourWorkBox;
