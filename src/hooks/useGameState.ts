import { useState } from "react";

interface Message {
  text: string;
  isBot: boolean;
}

const INITIAL_MESSAGE = "Welcome brave adventurer! You find yourself at the entrance of an ancient temple. The stone walls are covered in mysterious symbols, and you can hear strange echoes from within. What would you like to do?\n\n1. Enter the temple cautiously\n2. Examine the symbols on the walls\n3. Listen carefully to the echoes\n4. Search for alternative entrances";

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