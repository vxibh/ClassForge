import { useState, useEffect } from "react";
import { Button, Alert } from "react-bootstrap";
import { executeCode } from "../api";
import { useRouter } from 'next/navigation';


const Output = ({ editorRef, language, userId, problemId }) => {
  const [output, setOutput] = useState([]);
  const [isLoadingRun, setIsLoadingRun] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isErrorRun, setIsErrorRun] = useState(false);
  const [isErrorSubmit, setIsErrorSubmit] = useState(false);
  const [user, setUser] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(null);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;

    try {
      setIsLoadingRun(true);
      const { run: result } = await executeCode(language, sourceCode);
      console.log(result)
      setOutput(result.output.split("\n"));
      setIsErrorRun(!!result.stderr);
    } catch (error) {
      console.error("Error running code:", error);
      setIsErrorRun(true);
    } finally {
      setIsLoadingRun(false);
    }
  };

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
        console.log('From Output Component:', data);
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

  const submitCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
  
    try {
      setIsLoadingSubmit(true);
      const response = await fetch(`http://localhost:5000/api/problemSubmission/submit`, {  // Make sure this URL is correct
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          problemId,
          code: sourceCode,
          language,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit code');
      }
  
      alert('Code submitted successfully!');
      router.push(`/classes/${problemId}/posts/${problemId}`);
    } catch (error) {
      console.error("Error submitting code:", error);
      setIsErrorSubmit(true);
    } finally {
      setIsLoadingSubmit(false);
    }
  };
  

  return (
    <div className="h-3/5">
      <h2 className="text-lg mb-2">Output</h2>
      <Button
        className="mb-4"
        disabled={isLoadingRun || isLoadingSubmit}
        onClick={runCode}
        style={{
          border: 'solid #ffffffa3 2px',
          borderRadius: '4px',
          padding: '0px 5px',
        }}
      >
        {isLoadingRun ? "Running..." : "Run Code"}
      </Button>
      <Button
        className="mb-4 ml-4"
        disabled={isLoadingSubmit || isLoadingRun}
        onClick={submitCode}
        style={{
          border: 'solid #ffffffa3 2px',
          borderRadius: '4px',
          padding: '0px 5px',
        }}
      >
        {isLoadingSubmit ? "Submitting..." : "Submit"}
      </Button>

      <div
        className={`h-full p-2 border rounded ${
          isErrorRun || isErrorSubmit ? "border-red-500 text-red-400" : "border-gray-300"
        } overflow-y-auto`}
      >
        {output.length > 0 ? (
          output.map((line, index) => (
            <pre key={index} className="whitespace-pre-wrap">
              {line}
            </pre>
          ))
        ) : (
          <p className="text-center text-gray-400">
            Click "Run Code" to see the output here
          </p>
        )}
      </div>
      {(isErrorRun || isErrorSubmit) && (
        <Alert variant="danger" className="mt-4">
          {isErrorRun && "An error occurred while running the code."}
          {isErrorSubmit && "An error occurred while submitting the code."}
        </Alert>
      )}
    </div>
  );
};

export default Output;
