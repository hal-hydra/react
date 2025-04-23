import React, { useState, useRef, useEffect, useCallback } from "react";
import "./ChatInput.css";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isTyping }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-resize textarea
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && !isTyping) {
        onSendMessage(input);
        setInput("");
        if (inputRef.current) {
          inputRef.current.style.height = "auto";
        }
      }
    },
    [input, isTyping, onSendMessage]
  );

  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <textarea
        ref={inputRef}
        className="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your response..."
        disabled={isTyping}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        className="send-button"
        disabled={!input.trim() || isTyping}
        aria-label="Send message"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
        >
          <path
            d="M22 2L11 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;
