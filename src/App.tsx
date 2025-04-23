// src/App.tsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import ChatMessage from "./components/ChatMessage.tsx";
import ChatInput from "./components/ChatInput";
import BubbleAnimation from "./components/BubbleAnimation.tsx";
import TypingIndicator from "./components/TypingIndicator";
import { Message } from "./types.ts";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = "https://a414-103-174-110-64.ngrok-free.app/chat"; // Your backend URL

  useEffect(() => {
    // Initial welcome message
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          content:
            "Hi there! I'm your personality assessment guide. Let's explore your personality through assessment. Ready to begin?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const { data } = await axios.post(
        BACKEND_URL,
        {
          message,
          history: messages.map((msg) => ({
            content: msg.content,
            role: msg.sender === "user" ? "user" : "assistant",
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Backend response:", data); // 🐛 Debug print

      // Simulate typing delay
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response
            ? data.response
            : "🤖 I'm still learning. Can you tell me more?",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching response:", error);

      // Fallback response in case of error
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "⚠️ Unable to connect. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <header className="chat-header">
          <h1>Personality Assessment</h1>
          <p>Discover yourself through interactive storytelling</p>
        </header>

        <div className="messages-container">
          <BubbleAnimation />
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={sendMessage} isTyping={isTyping} />
      </div>
    </div>
  );
}

export default App;
