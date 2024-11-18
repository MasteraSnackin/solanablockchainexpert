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
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Download, Moon, Sun } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from "@/components/LanguageSelector";
import '../i18n/config';

const Index = () => {
  const { toast } = useToast();
  const { speak, stopSpeaking, setVoice, currentVoice } = useSpeech();
  const { messages, setMessages, isTyping, setIsTyping } = useGameState();
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useTranslation();
  
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

  const exportChat = () => {
    const chatLogs = messages
      .map(msg => `${msg.isBot ? "Game Master" : "Player"}: ${msg.text}`)
      .join("\n\n");
    
    const blob = new Blob([chatLogs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Chat exported!",
      description: "The chat history has been downloaded as a text file.",
    });
  };

  const restartChat = () => {
    setMessages([{ text: messages[0].text, isBot: true }]);
    toast({
      title: "Chat Restarted",
      description: "The chat has been reset to the beginning.",
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
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 shrink-0"
                onClick={copyChatlogs}
              >
                <Copy className="w-4 h-4" />
                {t('Copy Chat Logs')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 shrink-0"
                onClick={exportChat}
              >
                <Download className="w-4 h-4" />
                {t('Export Chat')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 shrink-0"
                onClick={restartChat}
              >
                <RefreshCw className="w-4 h-4" />
                {t('Restart Chat')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 shrink-0"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {t('Dark Mode')}
              </Button>
              <LanguageSelector />
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