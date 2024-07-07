import { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { executeCode } from "../api";
import { useRouter } from 'next/navigation';

const Output = ({ editorRef, language, classId, postId }) => {
  const [output, setOutput] = useState([]);
  const [isLoadingRun, setIsLoadingRun] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isErrorRun, setIsErrorRun] = useState(false);
  const [isErrorSubmit, setIsErrorSubmit] = useState(false);
  const router = useRouter();

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

  const submitCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;

    try {
      setIsLoadingSubmit(true);
      const response = await fetch(`http://localhost:5000/api/postSubmissions/${classId}/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: postId,
          code: sourceCode,
          language,
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
