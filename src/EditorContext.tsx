import React, { createContext, useContext } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// 1. Create the Context
const EditorContext = createContext({} as any);

// 2. Create the Provider Component
export const EditorProvider = ({ children, content }: any) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "<p>Hello world from the context! 👋</p>",
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      {children}
    </EditorContext.Provider>
  );
};

// 3. Create a custom hook to access the context
export const useTiptapEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useTiptapEditor must be used within an EditorProvider");
  }
  return context;
};
