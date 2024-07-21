import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import Output from "./OutputDetails";
import CustomInput from "./CustomInput"; // Adjust the import path as needed
import { useEffect } from "react";

const CodeEditor = ({ onChange, language, code, theme, user, problemId,postId }) => {
  const [value, setValue] = useState(code || "");
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    const fetchPreviousSubmission = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/problemSubmission/user/${user}/problem/${problemId}/language/${language}`);
        if (response.ok) {
          const data = await response.json();
          setValue(data.code);
        } else {
          setValue(CODE_SNIPPETS[language]);
        }
      } catch (error) {
        setValue(CODE_SNIPPETS[language]);
      } finally {
        setIsLoading(false);
      }
    };

    console.log("User:", user);
    if (user && problemId) {
      fetchPreviousSubmission();
    }
  }, [user, problemId, language]);

  const onSelect = (language) => {
    setLanguage(language);
    setIsLoading(true);
    const fetchPreviousSubmission = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/problemSubmission/user/${user}/problem/${problemId}/language/${language}`);
        if (response.ok) {
          const data = await response.json();
          setValue(data.code);
        } else {
          setValue(CODE_SNIPPETS[language]);
        }
      } catch (error) {
        setValue(CODE_SNIPPETS[language]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreviousSubmission();
  };

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl flex flex-col">
      <div className="flex-grow">
        <Editor
          height="100%"
          width="100%"
          language={language || "javascript"}
          value={value}
          theme={theme}
          defaultValue="// some comment"
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
