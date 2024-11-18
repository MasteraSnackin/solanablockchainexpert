import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { VoiceSettings } from "./VoiceSettings";
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  isSpeaking: boolean;
  toggleSpeech: () => void;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  currentVoice: SpeechSynthesisVoice | null;
}

export const Header = ({ isSpeaking, toggleSpeech, onVoiceChange, currentVoice }: HeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <header className="border-b p-4 bg-gradient-to-r from-purple-100 to-blue-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          {t('Interactive Adventure Quest')}
        </h1>
        <div className="flex items-center gap-4">
          {isSpeaking && (
            <VoiceSettings onVoiceChange={onVoiceChange} currentVoice={currentVoice} />
          )}
          <Button
            onClick={toggleSpeech}
            variant="ghost"
            size="icon"
            className="hover:bg-purple-200 transition-colors"
          >
            {isSpeaking ? (
              <Volume2 className="h-5 w-5 text-purple-700" />
            ) : (
              <VolumeX className="h-5 w-5 text-gray-500" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};