import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useToast } from "@/components/ui/use-toast";
import { Groq } from "groq-sdk";

interface Message {
  text: string;
  isBot: boolean;
}

const INITIAL_MESSAGE = "Hello! How can I help you today?";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: INITIAL_MESSAGE, isBot: true },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const generateBotResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      const client = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
      });

      const chatHistory = messages.map(msg => ({
        role: msg.isBot ? "assistant" as const : "user" as const,
        content: msg.text,
      }));

      const completion = await client.chat.completions.create({
        messages: [
          ...chatHistory,
          { role: "user" as const, content: userMessage }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    } catch (error) {
      console.error("Groq API Error:", error);
      throw new Error("Failed to get response from Groq");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, isBot: false }]);

    try {
      const botResponse = await generateBotResponse(message);
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold text-gray-800">Chat Assistant</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isBot={message.isBot}
          />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <ChatInput onSend={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default Index;