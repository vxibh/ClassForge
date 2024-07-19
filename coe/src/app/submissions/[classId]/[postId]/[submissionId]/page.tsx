'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Modal from '@/components/modal';
import { ClimbingBoxLoader } from 'react-spinners';
import { checkResultsUntilComplete, evaluateSubmissions, fetchProblemDetail, submitBatch } from '@/lib/evaluation';

interface ProblemSubmission {
  _id: string;
  problemId: string;
  userId: string;
  submission: string;
  createdAt: Date;
}

interface PostSubmission {
  _id: string;
  postId: string;
  userId: string;
  createdAt: Date;
  problemSubmissions: ProblemSubmission[];
}

const SubmissionPage = ({ params }: { params: { classId: string; postId: string; submissionId: string } }) => {
  const [postSubmission, setPostSubmission] = useState<PostSubmission | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ProblemSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    const fetchPostSubmission = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await fetch(`http://localhost:5000/api/postSubmissions/${params.submissionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch post submission data');
        }

        const data: PostSubmission = await response.json();
        setPostSubmission(data);
      } catch (error) {
        console.error('Error fetching post submission data:', error);
        setError('Failed to fetch post submission data');
      } finally {
        setLoading(false);
      }
    };

    fetchPostSubmission();
  }, [params.submissionId]);
  
  const handleViewSubmissionClick = (submission: ProblemSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClimbingBoxLoader color="#4A90E2" size={20} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!postSubmission) {
    return <div>No post submission found</div>;
  }

  const handleMenuItemClick = (itemId: string) => {};

  const handleEvaluateClick = async () => {
    if (!postSubmission) return;

    setEvaluating(true);

    try {
        const problemSubmissions = postSubmission.problemSubmissions;
        
        const response = await fetch(`http://localhost:5000/api/evaluate`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ problemSubmissions })
      });      

        // Assuming you might want to update the UI or state after evaluation
        console.log('Evaluations complete');
    } catch (error) {
        console.error('Error evaluating submissions:', error);
        setError('Failed to evaluate submissions');
    } finally {
        setEvaluating(false);
    }
};

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: '56px' }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full">
            <h2 className="text-2xl font-bold mb-2">Problem Submissions for Post Submission</h2>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mb-4 float-right"
              onClick={handleEvaluateClick}
              disabled={evaluating}
            >
              {evaluating ? 'Evaluating...' : 'Evaluate'}
            </button>
            <div className="grid grid-cols-1 gap-4">
              {postSubmission.problemSubmissions.map((problemSubmission, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h3 className="text-xl font-semibold mb-2">
                    Problem ID: {problemSubmission.problemId}
                  </h3>
                  <div className="text-gray-700 mb-2">
                    Date of submission: {new Date(problemSubmission.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleViewSubmissionClick(problemSubmission)}
                  >
                    View submission
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedSubmission && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Problem Submission</h2>
            <div className="text-gray-700 mb-2">
              <strong>Problem ID:</strong> {selectedSubmission.problemId}
            </div>
            <div className="text-gray-700 mb-2">
              <strong>Date of submission:</strong> {new Date(selectedSubmission.createdAt).toLocaleDateString()}
            </div>
            <div className="text-gray-700 mb-2">
              <strong>Submission Code:</strong>
              <pre className="bg-gray-200 p-2 rounded">{selectedSubmission.code}</pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionPage;
