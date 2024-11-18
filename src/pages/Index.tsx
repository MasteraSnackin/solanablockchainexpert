import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useToast } from "@/components/ui/use-toast";

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
    // Simulate bot response - replace with actual API call
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsTyping(false);
    
    const botResponses = [
      "I understand your question. Let me help you with that.",
      "That's an interesting point. Here's what I think...",
      "I'd be happy to assist you with that.",
      "Let me provide some information about that.",
    ];
    
    return botResponses[Math.floor(Math.random() * botResponses.length)];
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    setMessages((prev) => [...prev, { text: message, isBot: false }]);

    try {
      // Get bot response
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