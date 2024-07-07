import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { CODE_SNIPPETS } from "../constants";

const CodeEditor = ({ classId, postId }) => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

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
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <LanguageSelector language={language} onSelect={onSelect} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Editor
          options={{
            minimap: { enabled: false },
          }}
          height="100%"
          theme="vs-dark"
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          onMount={onMount}
          value={value}
          onChange={(value) => setValue(value)}
        />
      </div>
      <div className="h-2/5">
        <Output editorRef={editorRef} language={language} classId={classId} postId={postId} />
      </div>
    </div>
  );
};

export default CodeEditor;
