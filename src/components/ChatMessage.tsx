// src/components/ChatMessage.tsx
import { Message } from "../types";
import "./ChatMessage.css";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`chat-message ${message.sender}`}>
      <div className="message-bubble">{message.content}</div>
      {message.timestamp && (
        <div className="message-timestamp">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
