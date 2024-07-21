'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Modal from '@/components/modal';
import { ClimbingBoxLoader, HashLoader } from 'react-spinners';
import { toast } from 'react-toastify';

interface ProblemSubmission {
  code: ReactNode;
  _id: string;
  problemId: string;
  userId: string;
  submission: string;
  createdAt: Date;
  score?: number;  // Make score field optional

}

interface PostSubmission {
  _id: string;
  postId: string;
  userId: string;
  createdAt: Date;
  problemSubmissions: ProblemSubmission[];
  totalScore: number;  // Add totalScore field

}

interface ProblemResult {
  problemId: string;
  passedTestCases: number;
  totalTestCases: number;
  results: any[];
}

const SubmissionPage = ({ params }: { params: { classId: string; postId: string; submissionId: string } }) => {
  const [postSubmission, setPostSubmission] = useState<PostSubmission | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ProblemSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [evaluating, setEvaluating] = useState(false);
  const [problemResults, setProblemResults] = useState<ProblemResult[]>([]);
  const [skippedSubmissions, setSkippedSubmissions] = useState<ProblemSubmission[]>([]); // New state for skipped submissions


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
  
      if (!response.ok) {
        const errorText = await response.text(); // Capture the error message
        throw new Error(`Failed to evaluate submissions: ${errorText}`);
      }

      const evaluationResults = await response.json();
  
      if (evaluationResults.skippedSubmissions && evaluationResults.skippedSubmissions.length > 0) {
        const skippedMsg = evaluationResults.skippedSubmissions
          .map(sub => `${sub.problemId} - ${sub.message}`)
          .join('\n');
          alert(`Some submissions have already been evaluated:\n${skippedMsg}`);
          router.push(`/submissions/${params.classId}/${params.postId}/`);
      }
  
      console.log('Raw evaluation results:', evaluationResults); // Log raw response
  
      const resultsArray = evaluationResults.problems;
  
      if (!Array.isArray(resultsArray)) {
        throw new Error('Evaluation results is not an array');
      }
  
      console.log('Evaluation results:', resultsArray); // Debugging statement
      setProblemResults(resultsArray);
  
    } catch (error) {
      console.error('Error evaluating submissions:', error);
      setError('Failed to evaluate submissions');
    } finally {
      setEvaluating(false);
    }
  };
  


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#fc03c2" size={40} aria-label="Loading Spinner" />
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

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1" style={{ marginTop: '56px' }}>
        <Sidebar onItemClick={handleMenuItemClick} />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full">
            <h2 className="text-2xl font-bold mb-2">Problem Submissions for Post Submission</h2>
            <button
              className={`bg-blue-500 text-white py-2 px-4 rounded mb-4 float-right ${evaluating || problemResults.length > 0 ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              onClick={handleEvaluateClick}
              disabled={evaluating || problemResults.length > 0}
            >
              {evaluating ? 'Evaluating...' : 'Evaluate'}
            </button>
            {evaluating && (
              <div className="absolute inset-0 flex justify-center items-center bg-gray-50 bg-opacity-75">
                <HashLoader color="#fc03c2" size={40} aria-label="Loading Spinner" />
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              {postSubmission.problemSubmissions.map((problemSubmission, index) => {
                const result = problemResults.find(result => result.problemId === problemSubmission.problemId);

                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      Problem ID: {problemSubmission.problemId}
                    </h3>
                    <div className="text-gray-700 mb-2">
                      Date of submission: {new Date(problemSubmission.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-gray-700 mb-2">
                      <strong>Score:</strong> {problemSubmission.score !== undefined ? problemSubmission.score : 'Not evaluated yet'} / {problemSubmission.totalNumberOfTestCases !== undefined ? problemSubmission.totalNumberOfTestCases : 'Not evaluated yet'}
                    </div>
                    {result && (
                      <div className="text-gray-700 mb-2">
                        <strong>Test Cases Passed:</strong> {result.passedTestCases} / {result.totalTestCases}
                      </div>
                    )}
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleViewSubmissionClick(problemSubmission)}
                    >
                      View submission
                    </button>
                  </div>
                );
              })}
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
            <div className="text-gray-700">
              <strong>Score:</strong> {selectedSubmission.score !== undefined ? selectedSubmission.score : 'Not evaluated yet'}
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionPage;