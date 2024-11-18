import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface Message {
  text: string;
  isBot: boolean;
}

export const useMessageHandler = (
  isSpeaking: boolean,
  speak: (text: string) => void,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSendMessage = async (message: string) => {
    console.log("Handling new message:", message);
    const messageToSend = selectedOption || message;
    if (!messageToSend) return;
    
    setMessages((prev) => [...prev, { text: messageToSend, isBot: false }]);
    setSelectedOption("");

    try {
      const botResponse = await generateBotResponse(messageToSend);
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