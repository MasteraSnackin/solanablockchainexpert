import { useState } from "react";

interface Message {
  text: string;
  isBot: boolean;
}

const INITIAL_MESSAGE = "Welcome! I am your Solana blockchain expert assistant. I can help you with:\n\n1. Understanding Solana's architecture and features\n2. Development guidance and best practices\n3. Latest updates in the Solana ecosystem\n4. Security considerations and tokenomics\n\nWhat would you like to learn about Solana?";

export const useGameState = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: INITIAL_MESSAGE, isBot: true },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  return {
    messages,
    setMessages,
    isTyping,
    setIsTyping,
  };
};