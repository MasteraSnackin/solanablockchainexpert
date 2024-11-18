import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Groq } from "groq-sdk";
import { useSpeech } from "@/hooks/useSpeech";
import { ChatContainer } from "@/components/ChatContainer";
import { SceneImage } from "@/components/SceneImage";
import { Header } from "@/components/Header";
import { GameControls } from "@/components/GameControls";

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
  const [selectedOption, setSelectedOption] = useState<string>("1");  // Set default to "1"
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
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

  const extractOptions = (message: string) => {
    const lines = message.split('\n');
    const options: string[] = [];
    
    for (const line of lines) {
      const match = line.match(/^\d+\.\s(.+)$/);
      if (match) {
        options.push(match[1].trim());
      }
    }
    
    return options;
  };

  const handleSendMessage = async (message: string) => {
    // If no specific message is provided, use "1" to select the first option
    const messageToSend = message || "1";
    
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

  const lastBotMessage = messages[messages.length - 1]?.isBot ? messages[messages.length - 1].text : null;
  const options = lastBotMessage ? extractOptions(lastBotMessage) : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        isSpeaking={isSpeaking}
        toggleSpeech={toggleSpeech}
        onVoiceChange={setVoice}
        currentVoice={currentVoice}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ChatContainer messages={messages} isTyping={isTyping} />
          </div>
          
          <GameControls
            options={options}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            handleSendMessage={handleSendMessage}
            isTyping={isTyping}
            isListening={isListening}
            toggleVoiceRecognition={toggleVoiceRecognition}
          />
        </div>
        
        <div className="w-[512px] bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
          {lastBotMessage && <SceneImage message={lastBotMessage} />}
        </div>
      </main>
    </div>
  );
};

export default Index;
