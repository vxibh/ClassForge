// src/components/ClassInfoCard.tsx
import React from 'react';

interface ClassInfoCardProps {
  title: string;
  description: string;
}

const ClassInfoCard: React.FC<ClassInfoCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-6">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-gray-700 text-lg">{description}</p>
    </div>
  );
};

export default ClassInfoCard;
