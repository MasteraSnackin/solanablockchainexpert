import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/components/ui/use-toast";
import { Groq } from "groq-sdk";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";
import VoiceSettings from "@/components/VoiceSettings";
import { ChatContainer } from "@/components/ChatContainer";
import { SceneImage } from "@/components/SceneImage";

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
  const [selectedOption, setSelectedOption] = useState<string>("");
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
    const messageToSend = selectedOption || message;
    if (!messageToSend) return;
    
    setMessages((prev) => [...prev, { text: messageToSend, isBot: false }]);
    setSelectedOption("");

    try {
      const botResponse = await generateBotResponse(messageToSend);
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      
      // Automatically speak the bot's response if speech is enabled
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
    <div className="flex h-screen flex-col bg-white">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Text Adventure Game</h1>
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

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <ChatContainer messages={messages} isTyping={isTyping} />
          <div className="border-t p-4 space-y-4">
            <Tabs defaultValue="choices" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="choices">Quick Choices</TabsTrigger>
                <TabsTrigger value="custom">Custom Response</TabsTrigger>
                <TabsTrigger value="voice">Voice Input</TabsTrigger>
              </TabsList>
              <TabsContent value="choices">
                {options.length > 0 && (
                  <div className="space-y-4">
                    <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button 
                      onClick={() => handleSendMessage("")} 
                      disabled={!selectedOption || isTyping}
                      className="w-full"
                    >
                      Choose Action
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="custom">
                <ChatInput onSend={handleSendMessage} disabled={isTyping} />
              </TabsContent>
              <TabsContent value="voice" className="flex justify-center">
                <Button
                  onClick={toggleVoiceRecognition}
                  variant={isListening ? "destructive" : "default"}
                  className="w-full flex items-center gap-2"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="w-[512px] border-l p-4 overflow-y-auto">
          {lastBotMessage && <SceneImage message={lastBotMessage} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
