// src/types.ts
export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }
  
  export interface ChatHistory {
    content: string;
    role: 'user' | 'assistant';
  }