import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Groq } from "groq-sdk";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/useSpeech";
import VoiceSettings from "@/components/VoiceSettings";
import { GameInterface } from "@/components/GameInterface";

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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const { speak, stopSpeaking, setVoice, currentVoice } = useSpeech();

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
    if (!message.trim()) return;
    
    setMessages((prev) => [...prev, { text: message, isBot: false }]);

    try {
      const botResponse = await generateBotResponse(message);
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      
      if (isSpeaking) {
        speak(botResponse);
      }
    } catch (error) {
      toast({
        title: "Game Master Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleVoiceRecognition = () => {
    if (!isListening) {
      if (!('webkitSpeechRecognition' in window)) {
        toast({
          title: "Voice Input Error",
          description: "Voice recognition is not supported in your browser. Please use Chrome.",
          variant: "destructive",
        });
        return;
      }

      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("Voice recognition started");
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("Voice input received:", transcript);
        handleSendMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Voice recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "There was an error with voice recognition. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        console.log("Voice recognition ended");
        setIsListening(false);
      };

      recognition.start();
    } else {
      setIsListening(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Text Adventure Game
        </h1>
        <div className="flex items-center gap-4">
          {isSpeaking && (
            <VoiceSettings onVoiceChange={setVoice} currentVoice={currentVoice} />
          )}
          <Button
            onClick={toggleSpeech}
            variant="ghost"
            size="icon"
            className="ml-2"
          >
            {isSpeaking ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      <GameInterface
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        isListening={isListening}
        toggleVoiceRecognition={toggleVoiceRecognition}
      />
    </div>
  );
};

export default Index;