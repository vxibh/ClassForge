// src/components/PostCard.tsx
import React from 'react';

interface PostCardProps {
  title: string;
  description: string;
  date: string;
}

const PostCard: React.FC<PostCardProps> = ({ title, description, date }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-2">{description}</p>
      <p className="text-gray-500 text-sm">Posted on: {date}</p>
    </div>
  );
};

export default PostCard;
