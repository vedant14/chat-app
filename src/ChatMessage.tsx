import { Node } from "@tiptap/core";

export const ChatMessage = Node.create({
  // The name of your custom node. You'll use this name in your editor configuration.
  name: "chatMessage",

  // The group a node belongs to. This helps ProseMirror understand its purpose.
  // 'block' is for block-level elements.
  group: "block",

  // Defines what content is allowed inside this node.
  // In this case, we want to allow 'paragraph' and 'heading' nodes.
  content: "paragraph+",

  // You can add attributes to your nodes, like an ID or a timestamp.
  addAttributes() {
    return {
      author: {
        default: null,
      },
      timestamp: {
        default: null,
      },
    };
  },

  // This is how Tiptap renders the node to HTML.
  renderHTML({ HTMLAttributes }) {
    // The first element in the array is the HTML tag.
    // The second element is an object of attributes.
    // The third element (0) is a placeholder for child content.
    return ["div", { ...HTMLAttributes, class: "chat-message" }, 0];
  },

  // This is how Tiptap parses HTML back into a node.
  parseHTML() {
    return [{ tag: "div.chat-message" }];
  },
});
