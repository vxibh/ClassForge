import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

function CreateClassroomForm({ onCreateClassroom }: { onCreateClassroom: (formData: any) => void }) {
  const [formData, setFormData] = useState<{
    name: string;
    section: string;
    descriptionHeading: string;
    description: string;
    room: string;
    ownerEmail: string | undefined; // Update ownerEmail type
  }>({
    name: '',
    section: '',
    descriptionHeading: '',
    description: '',
    room: '',
    ownerEmail: '', // Add ownerEmail field
  });

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ownerEmail: user?.primaryEmailAddress?.emailAddress,
      }));
    }
  }, [isLoaded, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateClassroom(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="section">
          Section
        </label>
        <input
          type="text"
          name="section"
          id="section"
          placeholder="Section"
          value={formData.section}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="descriptionHeading">
          Description Heading
        </label>
        <input
          type="text"
          name="descriptionHeading"
          id="descriptionHeading"
          placeholder="Description Heading"
          value={formData.descriptionHeading}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="room">
          Room
        </label>
        <input
          type="text"
          name="room"
          id="room"
          placeholder="Room"
          value={formData.room}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md"
      >
        Create Classroom
      </button>
    </form>
  );
}

export default CreateClassroomForm;
