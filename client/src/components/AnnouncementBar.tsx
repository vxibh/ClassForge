// AnnouncementBar.tsx

import React from 'react';

const AnnouncementBar: React.FC = () => {
  const announcements = [
    { text: 'New assignment posted: "Array Manipulation"', className: 'Class 1', time: '15 mins ago' },
    { text: 'Discussion on "Graph Theory" started', className: 'Class 2', time: '30 mins ago' },
    { text: 'Assignment due date extended', className: 'Class 3', time: '1 hour ago' },
    { text: 'New problem added: "Binary Search Tree"', className: 'Class 1', time: '2 hours ago' },
    { text: 'Weekly roundup meeting', className: 'Class 4', time: '3 hours ago' },
    { text: 'Midterm exam results announced', className: 'Class 2', time: '5 hours ago' }
  ];

  return (
    <div className="w-64 h-full bg-gray-100 p-4" style={{borderLeft: "solid #0000004d 0.5px"}}>
      <h2 className="text-xl font-bold mb-4">Announcements</h2>
      <ul>
        {announcements.map((announcement, index) => (
          <li key={index} className="mb-4 p-4 bg-white rounded shadow">
            <p className="text-sm">{announcement.text}</p>
            <p className="text-xs text-gray-500">{announcement.className}</p>
            <p className="text-xs text-gray-400">{announcement.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementBar;
