import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { CODE_SNIPPETS } from "../constants";

const CodeEditor = ({ user, problemId }) => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(true);

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

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    // Disable paste
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      console.log("Paste is disabled");
    });

    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Insert, () => {
      console.log("Paste is disabled");
    });
  };

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

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <LanguageSelector language={language} onSelect={onSelect} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Editor
            options={{
              minimap: { enabled: false },
            }}
            height="100%"
            theme="vs-dark"
            language={language}
            defaultValue={value}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        )}
      </div>
      <div className="h-2/5">
        <Output editorRef={editorRef} language={language} userId={user} problemId={problemId} />
      </div>
    </div>
  );
};

export default CodeEditor;
