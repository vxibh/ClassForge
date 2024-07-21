'use client';

import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { HashLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { classnames } from '@/utils/general';
import { languageOptions } from '@/constants/languageOptions';
import OutputWindow from '@/components/OutputWindow';
import CustomInput from '@/components/CustomInput';
import OutputDetails from '@/components/OutputDetails';

const LanguageSelector = dynamic(() => import('@/components/LanguageSelector'), { ssr: false });
const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false });

interface Problem {
  title: string;
  content: string;
  topicTags: { name: string }[];
}

interface User {
  _id: string;
}

const javascriptDefault = `/**
* Problem: Binary Search: Search a sorted array for a target value.
*/

// Time: O(log n)
const binarySearch = (arr, target) => {
 return binarySearchHelper(arr, target, 0, arr.length - 1);
};

const binarySearchHelper = (arr, target, start, end) => {
 if (start > end) {
   return false;
 }
 let mid = Math.floor((start + end) / 2);
 if (arr[mid] === target) {
   return mid;
 }
 if (arr[mid] < target) {
   return binarySearchHelper(arr, target, mid + 1, end);
 }
 if (arr[mid] > target) {
   return binarySearchHelper(arr, target, start, mid - 1);
 }
};

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 5;
console.log(binarySearch(arr, target));
`;

const ProblemPage = ({ params }: { params: { classId: string } } ) => {
  const [code, setCode] = useState(javascriptDefault);
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  const { problemId } = useParams<{ problemId: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState(languageOptions[0]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState("cobalt");
  const [processing, setProcessing] = useState(false);
  const [outputDetails, setOutputDetails] = useState(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isErrorSubmit, setIsErrorSubmit] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const editorRef = useRef<any>(null);  // Reference to CodeEditor
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUser(null);
      }
    };

    const fetchProblemDetails = async () => {
      if (!problemId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/problems/${problemId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.question) {
          throw new Error('Problem not found');
        }

        setProblem(data.question);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchProblemDetails();
  }, [problemId]);

  const handleCodeChange = (field, value) => {
    setCode(value);
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const submitCode = async () => {
    const sourceCode = code;
    console.log(user)
    if (!sourceCode) return;
  
    try {
      setIsLoadingSubmit(true);
      const response = await fetch(`http://localhost:5000/api/problemSubmission/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id,
          problemId: problemId,
          code: sourceCode,
          language: "cpp",
          status: "submitted",
          postId: postId
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit code');
      }
  
      alert('Code submitted successfully!');
      router.push(`/classes/${classId}/posts/${postId}`);
    } catch (error) {
      console.error("Error submitting code:", error);
      setIsErrorSubmit(true);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleCompileAndExecute = async () => {
    setProcessing(true);
    console.log(code);
    console.log(customInput)
    try {
      // Step 1: Submit code for compilation and execution
      const submitResponse = await fetch('http://localhost:2358/submissions?base64_encoded=false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_code: code,
          language_id: 76, // Ensure this is the correct language ID
          stdin: customInput, // Include custom input if available
        }),
      });
  
      if (!submitResponse.ok) {
        throw new Error(`HTTP error! status: ${submitResponse.status}`);
      }
  
      const { token } = await submitResponse.json();
  
      // Step 2: Poll for the result using the token
      const pollResult = async (token) => {
        const resultResponse = await fetch(`http://localhost:2358/submissions/${token}?base64_encoded=false`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!resultResponse.ok) {
          throw new Error(`HTTP error! status: ${resultResponse.status}`);
        }
  
        const result = await resultResponse.json();
  
        // If the result is not finished, poll again after a delay
        if (result.status.id <= 2) { // Status codes less than or equal to 2 indicate "In Queue" or "Processing"
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
          return await pollResult(token); // Recursive call
        }
  
        return result;
      };
  
      const result = await pollResult(token);
  
      // Decode the base64 outputs if necessary
      if (result.stdout && result.stdout.includes('base64')) {
        result.stdout = atob(result.stdout);
      }
      if (result.stderr && result.stderr.includes('base64')) {
        result.stderr = atob(result.stderr);
      }
  
      // Display the stdout in the OutputWindow
      setOutputDetails(result);
      toast.success('Compilation and execution successful!');
    } catch (error) {
      console.error('Error compiling and executing:', error);
      toast.error('Error compiling and executing');
    } finally {
      setProcessing(false);
    }
  };  
  
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader color="#fc03c2" loading={loading} size={40} aria-label="Loading Spinner" data-testid="loader" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!problem) {
    return <div>Problem not found</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 p-4 bg-gray-100 overflow-y-auto mt-14">
        <div className="w-1/2 pr-2">
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <p className="mb-4" dangerouslySetInnerHTML={{ __html: problem.content }} />
          <p className="mb-4">Tags: {problem.topicTags.map(tag => tag.name).join(', ')}</p>
        </div>
        <div className="w-4/5 flex flex-col">
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 mb-4"></div>
          <div className="flex flex-row items-center mb-4">
            <LanguageSelector onSelectChange={handleLanguageChange} />
          </div>
          <div className="flex-grow mb-4">
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              language={language?.value}
              theme={theme}
              ref={editorRef}  // Use ref to access CodeEditor instance
            />
          </div>
          <div className="flex flex-col space-y-4">
          <CustomInput customInput={customInput} setCustomInput={setCustomInput} />
            <div className="flex space-x-4">
              <button
                onClick={handleCompileAndExecute}
                disabled={!code}
                className={classnames(
                  "border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white",
                  !code ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Compile and Execute"}
              </button>
              <button
                onClick={submitCode}
                disabled={isLoadingSubmit || !code}
                className={classnames(
                  "border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white",
                  isLoadingSubmit || !code ? "opacity-50" : ""
                )}
              >
                {isLoadingSubmit ? "Submitting..." : "Submit"}
              </button>
            </div>
            {outputDetails && <OutputDetails outputDetails={outputDetails} />}
            {console.log(outputDetails)}
            <OutputWindow outputDetails={outputDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
