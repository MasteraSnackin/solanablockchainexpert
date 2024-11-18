import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateBotResponse } from "@/utils/botResponseGenerator";
import { Message } from "@/types/chat";

export const useMessageHandler = (
  isSpeaking: boolean,
  speak: (text: string) => void,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  messages: Message[],
  setIsTyping: (isTyping: boolean) => void
) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSendMessage = async (message: string) => {
    console.log("Handling new message:", message);
    const messageToSend = selectedOption || message;
    if (!messageToSend) return;
    
    setMessages((prev) => [...prev, { text: messageToSend, isBot: false }]);
    setSelectedOption("");

    try {
      const botResponse = await generateBotResponse(messageToSend, messages, setIsTyping);
      console.log("Bot response received:", botResponse);
      
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      
      if (isSpeaking) {
        speak(botResponse);
      }
    } catch (error) {
      console.error("Failed to get bot response:", error);
      toast({
        title: "Game Master Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    selectedOption,
    setSelectedOption,
    handleSendMessage,
  };
};