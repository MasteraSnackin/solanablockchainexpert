import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Groq } from "groq-sdk";

const SYSTEM_PROMPT = `You are SolanaBot, an advanced AI assistant specialized in the Solana blockchain ecosystem. Your role is to:
1. Provide accurate, technical information about Solana
2. Explain complex blockchain concepts clearly
3. Guide users through Solana development
4. Share updates about the Solana ecosystem
5. Discuss Solana's architecture and features
6. Help with best practices and security

Keep responses focused on Solana-related topics and maintain a professional, helpful tone.

Parameters:
temperature: 0
mirostat_tau: 1.0
num_ctx: 4096
top_k: 10
top_p: 0.5`;

interface UseGameLogicProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  speak: (text: string) => void;
  toast: typeof toast;
  messages: Message[];
  isSpeaking: boolean;
}

interface Message {
  text: string;
  isBot: boolean;
}

export const useGameLogic = ({ setMessages, setIsTyping, speak, toast, messages, isSpeaking }: UseGameLogicProps) => {
  const [selectedOption, setSelectedOption] = useState("");

  const generateBotResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("Groq API key is not configured");
      }

      const client = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      console.log("Sending request to Groq API for Solana expertise...");
      
      const chatHistory = messages.map(msg => ({
        role: msg.isBot ? "assistant" as const : "user" as const,
        content: msg.text,
      }));

      const completion = await client.chat.completions.create({
        messages: [
          { role: "system" as const, content: SYSTEM_PROMPT },
          ...chatHistory,
          { role: "user" as const, content: userMessage }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0,
        top_p: 0.5,
        max_tokens: 1024,
      });

      console.log("Received Solana expert response from Groq API:", completion);

      if (!completion.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from Groq API");
      }

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Solana Expert Error:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get response: ${error.message}`);
      }
      throw new Error("Failed to get response from Solana Expert");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    const messageToSend = selectedOption || message;
    if (!messageToSend) return;
    
    setMessages((prev) => [...prev, { text: messageToSend, isBot: false }]);
    setSelectedOption("");

    try {
      const botResponse = await generateBotResponse(messageToSend);
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      
      if (isSpeaking) {
        speak(botResponse);
      }
    } catch (error) {
      toast({
        title: "Solana Expert Error",
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