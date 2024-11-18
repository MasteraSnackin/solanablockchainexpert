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

const INITIAL_MESSAGE = "Welcome brave adventurer! You find yourself at the entrance of an ancient temple. The stone walls are covered in mysterious symbols, and you can hear strange echoes from within. What would you like to do?\n\n1. Enter the temple cautiously\n2. Examine the symbols on the walls\n3. Listen carefully to the echoes\n4. Search for alternative entrances";

const SYSTEM_PROMPT = `You are a Game Master running a text-based adventure game. Your role is to:
1. Create an immersive narrative experience
2. Always present exactly 4 numbered choices after each response
3. Respond to the player's choices with engaging descriptions
4. Keep track of the story context
5. Include elements of mystery, challenge, and discovery
6. Make choices have meaningful consequences

Format your responses like this:
[Narrative description of what happens based on their choice]

Choose your next action:
1. [Option 1]
2. [Option 2]
3. [Option 3]
4. [Option 4]`;

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: INITIAL_MESSAGE, isBot: true },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

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

      console.log("Sending request to Groq API for game response...");
      
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
        temperature: 0.7,
        max_tokens: 1024,
      });

      console.log("Received game response from Groq API:", completion);

      if (!completion.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from Groq API");
      }

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Game Master Error:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get response: ${error.message}`);
      }
      throw new Error("Failed to get response from Game Master");
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
        title: "Game Master Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold text-gray-800">Text Adventure Game</h1>
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