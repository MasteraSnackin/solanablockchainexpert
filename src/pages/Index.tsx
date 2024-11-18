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
        <div className="container mx-auto px-4 py-2 flex flex-col">
          <Header
            isSpeaking={isSpeaking}
            toggleSpeech={toggleSpeech}
            onVoiceChange={setVoice}
            currentVoice={currentVoice}
          />
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 w-full"
              onClick={copyChatlogs}
            >
              <Copy className="w-4 h-4" />
              Copy Chat Logs
            </Button>
          </div>
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
    const match = line.match(/^\d+\.\s(.+)$/);
    if (match) {
      options.push(match[1].trim());
    }
  }
  
  return options;
};

export default Index;