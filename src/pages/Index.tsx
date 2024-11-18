import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSpeech } from "@/hooks/useSpeech";
import { ChatContainer } from "@/components/ChatContainer";
import { SceneImage } from "@/components/SceneImage";
import { Header } from "@/components/Header";
import { GameControls } from "@/components/GameControls";
import { useGameState } from "@/hooks/useGameState";
import { useVoiceControl } from "@/hooks/useVoiceControl";
import { useMessageHandler } from "@/hooks/useMessageHandler";
import { useTranslation } from 'react-i18next';
import { ChatControls } from "@/components/ChatControls";
import { SettingsPanel } from "@/components/SettingsPanel";

const Index = () => {
  const { toast } = useToast();
  const { speak, stopSpeaking, setVoice, currentVoice } = useSpeech();
  const { messages, setMessages, isTyping, setIsTyping } = useGameState();
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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

  const restartChat = () => {
    setMessages([{ text: messages[0].text, isBot: true }]);
    toast({
      title: t("Chat Restarted"),
      description: t("Chat has been reset"),
    });
  };

  const lastBotMessage = messages[messages.length - 1]?.isBot 
    ? messages[messages.length - 1].text 
    : null;
    
  const options = lastBotMessage ? extractOptions(lastBotMessage) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-2">
          <Header
            isSpeaking={isSpeaking}
            toggleSpeech={toggleSpeech}
            onVoiceChange={setVoice}
            currentVoice={currentVoice}
          />
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ChatContainer messages={messages} isTyping={isTyping} />
          </div>
          
          <div className="border-t dark:border-gray-700 p-4 flex items-center gap-4">
            <div className="flex-1">
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
            <div className="flex flex-col gap-4">
              <ChatControls messages={messages} onRestart={restartChat} />
              <SettingsPanel isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </div>
          </div>
        </div>
        
        <div className="w-[512px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-y-auto">
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