// src/components/PostList.tsx
import React from 'react';

interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface PostListProps {
  posts: Post[];
  onPostClick: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {posts.map(post => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => onPostClick(post.id)}
        >
          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
          <p className="text-gray-700">{post.description}</p>
          <p className="text-gray-500 text-sm">{post.date}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;
