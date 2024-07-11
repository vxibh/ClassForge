import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';

const JoinClass = () => {
  const [inputCode, setInputCode] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [createError, setCreateError] = useState('');
  const [joinError, setJoinError] = useState('');
  const router = useRouter();
  const token = localStorage.getItem('token');
  console.log(token)

  useEffect(() => {
    if (inputTitle.length > 100) setCreateError('Title length must be less or equal to 100');
    else {
      if (inputDescription.length > 500) setCreateError('Description length must be less or equal to 500');
      else setCreateError('');
    }
  }, [inputTitle, inputDescription]);

  const openJoinTab = () => {
    document.querySelector('#join-class').style.display = 'block';
    document.querySelector('#create-class').style.display = 'none';
  };

  const openCreateTab = () => {
    document.querySelector('#join-class').style.display = 'none';
    document.querySelector('#create-class').style.display = 'block';
  };

  const createClass = async (e) => {
    e.preventDefault();
    try {
      if (createError === '') {
        const response = await fetch('http://localhost:5000/api/classes/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title: inputTitle, description: inputDescription })
        });

        if (response.status === 201) {
          const data = await response.json();
          setInputTitle('');
          setInputDescription('');
          router.push(`/classes/${data.classId}`);
        } else {
          const errorData = await response.json();
          setCreateError(errorData.message);
        }
      }
    } catch (error) {
      console.error('Create class failed:', error.message);
      setCreateError('Something went wrong.');
    }
  };

  const joinClass = async (e) => {
    e.preventDefault();
    try {
      if (joinError === '') {
        const response = await fetch('http://localhost:5000/api/classes/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ code: inputCode })
        });

        if (response.status === 200) {
          const data = await response.json();
          setInputCode('');
          router.push(`/classes/${data.classId}`);
        } else {
          const errorData = await response.json();
          setJoinError(errorData.message);
        }
      }
    } catch (error) {
      console.error('Join class failed:', error.message);
      setJoinError('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-center mb-4">
            <button className="btn btn-light mx-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded" onClick={openJoinTab}>Join class</button>
            <button className="btn btn-dark mx-2 px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded" onClick={openCreateTab}>Create class</button>
          </div>
          <div className="box-text">
            <form id="join-class" className="space-y-4" onSubmit={joinClass}>
              <h1 className="text-2xl font-bold mb-4">Join a class</h1>
              <h4 className="text-red-600">{joinError}</h4>
              <div className="form-group">
                <p className="form-label text-lg">Input a class code:</p>
                <input type="text" className="form-control block w-full px-4 py-2 border border-gray-300 rounded" value={inputCode} onChange={({ target: { value } }) => setInputCode(value)} />
              </div>
              <div className="form-group">
                <input type="submit" className="form-control btn btn-dark block w-full px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded cursor-pointer" value="Join Class" />
              </div>
            </form>
            <form id="create-class" className="box space-y-4 hidden" onSubmit={createClass}>
              <h1 className="text-2xl font-bold mb-4">Create class</h1>
              <h4 className="text-red-600">{createError}</h4>
              <div className="form-group">
                <p className="form-label text-lg">Class title:</p>
                <input type="text" className="form-control block w-full px-4 py-2 border border-gray-300 rounded" value={inputTitle} onChange={({ target: { value } }) => setInputTitle(value)} />
              </div>
              <div className="form-group">
                <p className="form-label text-lg">Class description:</p>
                <textarea className="form-control block w-full px-4 py-2 border border-gray-300 rounded" value={inputDescription} onChange={({ target: { value } }) => setInputDescription(value)} />
              </div>
              <div className="form-group">
                <input type="submit" className="form-control btn btn-dark block w-full px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded cursor-pointer" value="Create Class" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClass;
