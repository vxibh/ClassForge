// components/CreateClassroomButton.js
import { useState } from 'react';
import CreateClassroomForm from './CreateClassroomForm';

const CreateClassroomButton = ({ onCreateClassroom }: { onCreateClassroom: any }) => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const onCancel = () => {
    toggleForm();
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out"
        onClick={toggleForm}
      >
        {showForm ? '-' : '+'}
      </button>
      {showForm && <CreateClassroomForm onCreateClassroom={onCreateClassroom} onCancel={toggleForm} />}
    </div>
  );
};

export default CreateClassroomButton;
