import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from 'react-i18next';

interface Voice {
  name: string;
  voice: SpeechSynthesisVoice;
}

interface VoiceSettingsProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  currentVoice?: SpeechSynthesisVoice;
}

const VoiceSettings = ({ onVoiceChange, currentVoice }: VoiceSettingsProps) => {
  const [voices, setVoices] = React.useState<Voice[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { t } = useTranslation();

  React.useEffect(() => {
    const loadVoices = () => {
      setIsLoading(true);
      try {
        if (!('speechSynthesis' in window)) {
          throw new Error('Browser not supported');
        }

        const availableVoices = window.speechSynthesis.getVoices();
        const voiceOptions = availableVoices.map((voice) => ({
          name: `${voice.name} (${voice.lang})`,
          voice: voice,
        }));
        
        // Set default voice to Google UK English Female if available
        const defaultVoice = availableVoices.find(
          (voice) => voice.name === "Google UK English Female" && voice.lang === "en-GB"
        );
        
        if (defaultVoice && !currentVoice) {
          onVoiceChange(defaultVoice);
        }
        
        setVoices(voiceOptions);
      } catch (error) {
        console.error('Error loading voices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [onVoiceChange, currentVoice]);

  if (!('speechSynthesis' in window)) {
    return <div className="text-sm text-red-500">{t('Browser not supported')}</div>;
  }

  if (isLoading) {
    return <div className="text-sm text-gray-500">{t('Loading voices...')}</div>;
  }

  return (
    <Select
      onValueChange={(value) => {
        const selectedVoice = voices.find((v) => v.voice.name === value)?.voice;
        if (selectedVoice) {
          onVoiceChange(selectedVoice);
        }
      }}
      value={currentVoice?.name}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a voice" />
      </SelectTrigger>
      <SelectContent>
        {voices.map((voice) => (
          <SelectItem key={voice.voice.name} value={voice.voice.name}>
            {voice.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VoiceSettings;