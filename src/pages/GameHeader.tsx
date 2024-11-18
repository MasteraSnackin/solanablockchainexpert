import { Header } from "@/components/Header";

interface GameHeaderProps {
  isSpeaking: boolean;
  toggleSpeech: () => void;
  currentVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
}

export const GameHeader = ({
  isSpeaking,
  toggleSpeech,
  currentVoice,
  onVoiceChange,
}: GameHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div className="container mx-auto px-4 py-2">
        <Header
          isSpeaking={isSpeaking}
          toggleSpeech={toggleSpeech}
          onVoiceChange={onVoiceChange}
          currentVoice={currentVoice}
        />
      </div>
    </div>
  );
};