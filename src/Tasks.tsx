import "./styles.css";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import { Node, mergeAttributes } from "@tiptap/core";
import {
  EditorContent,
  useEditor,
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";

// Custom Document -> only contains message nodes
const CustomDocument = Document.extend({
  content: "message+",
});

// React component for message node
const MessageComponent = ({ node, updateAttributes, deleteNode }) => {
  const { author } = node.attrs;
  const authors = ["me", "them", "bot"]; // you can expand this list

  return (
    <NodeViewWrapper as="div" className="message-node" data-author={author}>
      {/* Controls that appear on hover */}
      <div className="message-controls">
        {/* Drag handle to move the node */}
        <div className="drag-handle" data-drag-handle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="12" r="1"></circle>
            <circle cx="9" cy="5" r="1"></circle>
            <circle cx="9" cy="19" r="1"></circle>
            <circle cx="15" cy="12" r="1"></circle>
            <circle cx="15" cy="5" r="1"></circle>
            <circle cx="15" cy="19" r="1"></circle>
          </svg>
        </div>
        {/* Delete button */}
        <button className="delete-button" onClick={deleteNode}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      {/* The main chat bubble */}
      <div className="bubble-content">
        {/* Dropdown to choose author */}
        <select
          className="author-select"
          value={author}
          onChange={(e) => updateAttributes({ author: e.target.value })}
        >
          {authors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {/* Editable content */}
        <NodeViewContent className="message-content" as="div" />
      </div>
    </NodeViewWrapper>
  );
};

// Message extension
const Message = Node.create({
  name: "message",
  group: "block",
  content: "paragraph+",
  draggable: true,

  addAttributes() {
    return {
      author: {
        default: "me",
        parseHTML: (el) => el.getAttribute("data-author"),
        renderHTML: (attrs) => ({ "data-author": attrs.author }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=message]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "message" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MessageComponent);
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const authors = ["me", "them", "bot"];
        const randomAuthor =
          authors[Math.floor(Math.random() * authors.length)];

        return editor
          .chain()
          .insertContent({
            type: "message",
            attrs: { author: randomAuthor },
            content: [{ type: "paragraph", content: [] }],
          })
          .focus()
          .run();
      },
    };
  },
});

export default function App() {
  const editor = useEditor({
    extensions: [
      CustomDocument,
      Paragraph,
      Text,
      Message,
      Dropcursor,
      Gapcursor,
    ],
    content: `
      <div data-type="message" data-author="me"><p>Hey, did you buy the groceries?</p></div>
      <div data-type="message" data-author="them"><p>Yes, I got flour, baking powder, and salt.</p></div>
      <div data-type="message" data-author="bot"><p>Still need to grab sugar, milk, eggs, and butter.</p></div>
      <div data-type="message" data-author="me"><p>Phew, okay. I'll get those on my way home. Thanks!</p></div>
    `,
    onUpdate({ editor }) {
      console.log("JSON:", editor.getJSON());
    },
  });

  return (
    <div className="editor-container">
      <EditorContent editor={editor} />
    </div>
  );
}
