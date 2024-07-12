import React from 'react';

interface Post {
  _id: string;
  title: string;
  description: string;
  date: string;
}

interface PostListProps {
  posts: Post[];
  onPostClick: (postId: string) => void;
  onDelete: (postId: string) => void; // Add onDelete prop
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick, onDelete, isTeacher }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {posts.map(post => (
        <div
          key={post._id}
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-xl font-semibold mb-2" onClick={() => onPostClick(post._id)}>{post.title}</h3>
          <p className="text-gray-700">{post.description}</p>
          <p className="text-gray-500 text-sm">{post.date}</p>
          {isTeacher &&(

          <button
            onClick={() => onDelete(post._id)}
            className="bg-red-500 text-white px-2 py-1 rounded mt-2"
          >
            Delete
          </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostList;
