// Personality Assessment Chatbot
// File: src/App.tsx

import { useState, useEffect, useRef } from "react";
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

  // Configure your backend URL here
  // TODO: Replace with your ngrok URL when available
  const BACKEND_URL =
    "https://a414-103-174-110-64.ngrok-free.app -> http://localhost:5000";

  useEffect(() => {
    // Initial welcome message
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          content:
            "Hi there! I'm your personality assessment guide. Let's explore your personality through Assement . Ready to begin?",
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
      // Call backend API to get response
      // TODO: Replace with actual API call to your backend
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: messages.map((msg) => ({
            content: msg.content,
            role: msg.sender === "user" ? "user" : "assistant",
          })),
        }),
      });

      const data = await response.json();

      // Simulate typing delay
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            data.response ||
            "I'm processing your input. Let's continue our assessment journey.",
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
          content:
            "I'm having trouble connecting to the assessment service. Please try again in a moment.",
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
