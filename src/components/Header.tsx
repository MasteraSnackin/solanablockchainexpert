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
          {t('Solana Blockchain Expert')}
        </h1>
      </div>
    </header>
  );
};