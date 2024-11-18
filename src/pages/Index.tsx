import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Groq } from "groq-sdk";
import { useSpeech } from "@/hooks/useSpeech";
import { ChatContainer } from "@/components/ChatContainer";
import { SceneImage } from "@/components/SceneImage";
import { Header } from "@/components/Header";
import { GameControls } from "@/components/GameControls";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useGameState } from "@/hooks/useGameState";
import { useVoiceControl } from "@/hooks/useVoiceControl";

const Index = () => {
  const { toast } = useToast();
  const { speak, stopSpeaking, setVoice, currentVoice } = useSpeech();
  const { messages, setMessages, isTyping, setIsTyping } = useGameState();
  const [isSpeaking, setIsSpeaking] = useState(true);
  const { selectedOption, setSelectedOption, handleSendMessage } = useGameLogic({ 
    setMessages, 
    setIsTyping, 
    speak, 
    toast,
    messages,
    isSpeaking 
  });
  const { isListening, toggleVoiceRecognition } = useVoiceControl({ handleSendMessage, toast });

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