// src/App.tsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import BubbleAnimation from "./components/BubbleAnimation";
import TypingIndicator from "./components/TypingIndicator";
import { Message } from "./types";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = "http://127.0.0.1:8000/chat"; // 🔁 Change to local when backend is ready

  useEffect(() => {
    // Initial welcome message
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          content:
            "Hi there! I'm your assessment guide. Let's explore through storytelling. Ready to begin?",
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

      console.log("Backend response:", data);

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            data.response ||
            data.reply ||
            "🤖 I'm still learning. Can you tell me more?",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching response:", error);

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
    <>
      {/* Floating Chat Icon */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="chat-button"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#4a6cf7",
            color: "#fff",
            fontSize: "24px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 9999,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
        >
          💬
        </button>
      )}

      {/* Chat Overlay */}
      {isChatOpen && (
        <div
          className="app-container"
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "380px",
            height: "520px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            overflow: "hidden",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <div
            className="chat-container"
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div
              className="messages-container"
              style={{
                flexGrow: 1,
                overflowY: "auto",
                padding: "0",
                backgroundColor: "#f8f9fb",
                backgroundImage:
                  "radial-gradient(#e3e8f4 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              <header
                className="chat-header"
                style={{
                  padding: "12px 16px",
                  background: "#4a6cf7",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  position: "sticky",
                  top: "0",
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <button
                  onClick={() => setIsChatOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    fontSize: "14px",
                    cursor: "pointer",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  }}
                >
                  ✕
                </button>
              </header>

              <div style={{ padding: "16px" }}>
                <BubbleAnimation />
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div
              style={{
                flexShrink: 0,
                padding: "12px 16px",
                backgroundColor: "#fff",
                borderTop: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <ChatInput onSendMessage={sendMessage} isTyping={isTyping} />
            </div>
          </div>
        </div>
      )}

      {/* Add CSS keyframes for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          /* Add custom scrollbar for messages container */
          .messages-container::-webkit-scrollbar {
            width: 6px;
          }
          
          .messages-container::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.05);
            border-radius: 10px;
          }
          
          .messages-container::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
          }
          
          .messages-container::-webkit-scrollbar-thumb:hover {
            background: rgba(0,0,0,0.3);
          }
        `}
      </style>
    </>
  );
}

export default App;
