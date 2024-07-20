import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Announcement {
  text: string;
  className: string;
  time: string;
}

const AnnouncementBar: React.FunctionComponent = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/announcements', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
          }
        });
        const data = await response.json()
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const differenceInHours = (now.getTime() - time.getTime()) / 1000 / 60 / 60;

    if (differenceInHours < 24) {
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return time.toLocaleDateString();
    }
  };

  return (
    <div className="w-64 h-full bg-gray-100 p-4" style={{ borderLeft: "solid #0000004d 0.5px" }}>
      <h2 className="text-xl font-bold mb-4">Announcements</h2>
      <ul>
        {announcements.map((announcement, index) => (
          <li key={index} className="mb-4 p-4 bg-white rounded shadow">
            <p className="text-sm">{announcement.text}</p>
            <p className="text-xs text-gray-500">{announcement.className}</p>
            <p className="text-xs text-gray-400">{formatTime(announcement.time)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementBar;