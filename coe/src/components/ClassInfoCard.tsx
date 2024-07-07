// src/components/ClassInfoCard.tsx
import React from 'react';

interface ClassInfoCardProps {
  title: string;
  description: string;
  code: string; // Add code prop
}

const ClassInfoCard: React.FC<ClassInfoCardProps> = ({ title, description, code }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-6">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-gray-700 text-lg">{description}</p>
      <p className="text-gray-500 text-sm mt-2">Class Code: {code}</p> {/* Display class code */}
    </div>
  );
};

export default ClassInfoCard;
