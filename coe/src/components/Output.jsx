import { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { executeCode } from "../api";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      console.log(result)
      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr);
    } catch (error) {
      console.error("Error running code:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-3/5">
      <h2 className="text-lg mb-2">Output</h2>
      <Button
        variant="outline-success"
        className="mb-4"
        disabled={isLoading}
        onClick={runCode}
      >
        {isLoading ? "Running..." : "Run Code"}
      </Button>
      <div
        className={`h-full p-2 border rounded ${
          isError ? "border-red-500 text-red-400" : "border-gray-300"
        } overflow-y-auto`}
      >
        {console.log(output)}
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
      {isError && (
        <Alert variant="danger" className="mt-4">
          An error occurred while running the code.
        </Alert>
      )}
    </div>
  );
};

export default Output;
