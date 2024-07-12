// src/app/page.tsx
'use client';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';
import JoinClass from '@/components/JoinClass'; // Adjust the import path as needed

const JoinClassPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: '56px' }}>
        <Sidebar onItemClick={()=>{}}/>
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Join or Create Class</h1>
          <JoinClass />
        </div>
        <AnnouncementBar />
      </div>
    </div>
  );
};

export default JoinClassPage;
