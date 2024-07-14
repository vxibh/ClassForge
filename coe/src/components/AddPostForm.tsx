import React, { useState } from 'react';
import ProblemSetOverlay, { Problem } from './ProblemSetOverlay';

interface AddPostFormProps {
  onSubmit: (postData: any) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectProblems: (selectedProblems: Problem[]) => void;
  onClose: () => void;
}

const AddPostForm: React.FC<AddPostFormProps> = ({ onSubmit, onFileChange, onSelectProblems, onClose }) => {
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    content: '',
    date: '',
    dueDate: '',
    materials: [],
    file: null, // Add file state
  });

  const [showProblemSetOverlay, setShowProblemSetOverlay] = useState(false); // State for showing problem set overlay

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setNewPost((prevPost) => ({
        ...prevPost,
        file: files[0], // Store the file in the state
      }));
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();

    const formattedMaterials = newPost.materials.map((material: Problem) => ({
      title: material.title,
      titleSlug: material.titleSlug,
    }));
    
    const postData = {
      ...newPost,
      date: currentDate,
    };

    onSubmit(postData);
    setNewPost({
      title: '',
      description: '',
      content: '',
      date: '',
      dueDate: '',
      materials: [],
      file: null,
    });
  };


  const handleSelectProblems = (selectedProblems) => {
    const formattedMaterials = selectedProblems.map(problem => ({
      id: problem.id,
      title: problem.title,
      titleSlug: problem.titleSlug,
      type: problem.type,
      link: problem.link,
    }));
    
    setNewPost(prevPost => ({
      ...prevPost,
      materials: [...prevPost.materials, ...formattedMaterials],
    }));
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="relative bg-white p-8 rounded-lg w-full max-w-4xl max-h-screen overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-lg font-bold mb-4">Add Post</h2>
        <form onSubmit={handlePostSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              name="description"
              value={newPost.description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
              Content
            </label>
            <input
              type="text"
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={newPost.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={newPost.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Materials</label>
            <ul>
              {newPost.materials.map((material, index) => (
                <li key={index} className="mb-2">
                  {typeof material === 'string' ? material : material.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4 flex">
            <div className="flex-1 mr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileUpload">
                Upload File
              </label>
              <input
                type="file"
                name="fileUpload"
                accept=".doc,.docx,.pdf"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowProblemSetOverlay(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
              >
                Select from Problem Set
              </button>
            </div>
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>

        {/* Problem Set Overlay */}
        {showProblemSetOverlay && (
          <ProblemSetOverlay
            onClose={() => setShowProblemSetOverlay(false)}
            onSelectProblems={handleSelectProblems}
          />
        )}
      </div>
    </div>
  );
};

export default AddPostForm;
