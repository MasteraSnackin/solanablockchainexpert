import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Mic, MicOff } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { useTranslation } from 'react-i18next';

interface GameControlsProps {
  options: string[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  handleSendMessage: (message: string) => void;
  isTyping: boolean;
  isListening: boolean;
  toggleVoiceRecognition: () => void;
}

export const GameControls = ({
  options,
  selectedOption,
  setSelectedOption,
  handleSendMessage,
  isTyping,
  isListening,
  toggleVoiceRecognition,
}: GameControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className="border-t p-6 bg-white rounded-b-lg shadow-inner">
      <Tabs defaultValue="choices" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="choices" className="text-sm">{t('Quick Choices')}</TabsTrigger>
          <TabsTrigger value="custom" className="text-sm">{t('Custom Response')}</TabsTrigger>
          <TabsTrigger value="voice" className="text-sm">{t('Voice Input')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="choices" className="space-y-4">
          {options.length > 0 && (
            <div className="space-y-4">
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button 
                onClick={() => handleSendMessage("")} 
                disabled={!selectedOption || isTyping}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {t('Choose Action')}
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
            className="w-full flex items-center gap-2 h-12"
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5" />
                {t('Stop Recording')}
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                {t('Start Recording')}
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};