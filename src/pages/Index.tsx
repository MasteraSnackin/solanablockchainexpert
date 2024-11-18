import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSpeech } from "@/hooks/useSpeech";
import { ChatContainer } from "@/components/ChatContainer";
import { Header } from "@/components/Header";
import { GameControls } from "@/components/GameControls";
import { useGameState } from "@/hooks/useGameState";
import { useVoiceControl } from "@/hooks/useVoiceControl";
import { useMessageHandler } from "@/hooks/useMessageHandler";
import { VoiceSettings } from "@/components/VoiceSettings";
import { useTranslation } from 'react-i18next';
import { GameHeader } from "./GameHeader";
import { ChatOptions } from "@/components/ChatOptions";
import { ThemeProvider } from "next-themes";

const Index = () => {
  const { toast } = useToast();
  const { speak, stopSpeaking, setVoice, currentVoice } = useSpeech();
  const { messages, setMessages, isTyping, setIsTyping } = useGameState();
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const { t } = useTranslation();
  
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

  const handleRestart = () => {
    setMessages([{ text: t('Welcome! I am your Solana blockchain expert assistant. How can I help you today?'), isBot: true }]);
    setSelectedOption("");
    toast({
      title: t('Chat Restarted'),
      description: t('The conversation has been reset'),
    });
  };

  const lastBotMessage = messages[messages.length - 1]?.isBot 
    ? messages[messages.length - 1].text 
    : null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <GameHeader 
          isSpeaking={isSpeaking}
          toggleSpeech={toggleSpeech}
          currentVoice={currentVoice}
          onVoiceChange={setVoice}
        />
        
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
            <ChatOptions messages={messages} onRestart={handleRestart} />
            <ChatContainer messages={messages} isTyping={isTyping} />
            <GameControls
              options={extractOptions(lastBotMessage || '')}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              handleSendMessage={handleSendMessage}
              isTyping={isTyping}
              isListening={isListening}
              toggleVoiceRecognition={toggleVoiceRecognition}
            />
          </div>
          
          {isSpeaking && (
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <VoiceSettings
                onVoiceChange={setVoice}
                currentVoice={currentVoice}
                speed={speed}
                pitch={pitch}
                volume={volume}
                onSpeedChange={setSpeed}
                onPitchChange={setPitch}
                onVolumeChange={setVolume}
              />
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
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