import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSpeech } from "@/hooks/useSpeech";
import { ChatContainer } from "@/components/ChatContainer";
import { SceneImage } from "@/components/SceneImage";
import { Header } from "@/components/Header";
import { GameControls } from "@/components/GameControls";
import { useGameState } from "@/hooks/useGameState";
import { useVoiceControl } from "@/hooks/useVoiceControl";
import { useMessageHandler } from "@/hooks/useMessageHandler";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const { speak, stopSpeaking, setVoice, currentVoice } = useSpeech();
  const { messages, setMessages, isTyping, setIsTyping } = useGameState();
  const [isSpeaking, setIsSpeaking] = useState(true);
  
  const { selectedOption, setSelectedOption, handleSendMessage } = useMessageHandler(
    isSpeaking,
    speak,
    setMessages,
    messages,
    setIsTyping
  );
  
  const { isListening, toggleVoiceRecognition } = useVoiceControl({ 
    handleSendMessage, 
    toast 
  });

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setIsSpeaking(!isSpeaking);
  };

  const copyChatlogs = () => {
    const chatLogs = messages
      .map(msg => `${msg.isBot ? "Game Master" : "Player"}: ${msg.text}`)
      .join("\n\n");
    
    navigator.clipboard.writeText(chatLogs).then(() => {
      toast({
        title: "Chat logs copied!",
        description: "The chat history has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Could not copy chat logs to clipboard.",
        variant: "destructive",
      });
    });
  };

  const lastBotMessage = messages[messages.length - 1]?.isBot 
    ? messages[messages.length - 1].text 
    : null;
    
  const options = lastBotMessage ? extractOptions(lastBotMessage) : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Header
            isSpeaking={isSpeaking}
            toggleSpeech={toggleSpeech}
            onVoiceChange={setVoice}
            currentVoice={currentVoice}
          />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={copyChatlogs}
          >
            <Copy className="w-4 h-4" />
            Copy Chat Logs
          </Button>
        </div>
      </div>
      
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

const extractOptions = (message: string) => {
  const lines = message.split('\n');
  const options: string[] = [];
  
  for (const line of lines) {
    const match = line.match(/

Certainly! Let's add an option to copy the chat logs after the conversation. We'll implement this by adding a "Copy Chat Logs" button at the bottom of the chat container. When clicked, it will copy the entire conversation to the clipboard.

<lov-code>
To implement this feature, we need to make the following changes:

1. Update the ChatContainer component to include a "Copy Chat Logs" button.
2. Add a function to handle copying the chat logs.
3. Use the clipboard API to copy the text.

Let's modify the ChatContainer.tsx file:

<lov-write file_path="src/components/ChatContainer.tsx">
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
}

export const ChatContainer = ({ messages, isTyping }: ChatContainerProps) => {
  const copyChatlogs = () => {
    const chatLogs = messages
      .map((message) => `${message.isBot ? "Bot" : "You"}: ${message.text}`)
      .join("\n\n");

    navigator.clipboard.writeText(chatLogs).then(
      () => {
        toast({
          title: "Chat logs copied!",
          description: "The chat logs have been copied to your clipboard.",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy chat logs. Please try again.",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message.text} isBot={message.isBot} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      <div className="p-4 border-t">
        <Button onClick={copyChatlogs} className="w-full">
          Copy Chat Logs
        </Button>
      </div>
    </div>
  );
};