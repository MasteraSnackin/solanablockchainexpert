import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const voiceOptions = availableVoices.map((voice) => ({
        name: `${voice.name} (${voice.lang})`,
        voice: voice,
      }));
      console.log("Available voices loaded:", voiceOptions);
      setVoices(voiceOptions);
    };

    // Load voices immediately if available
    loadVoices();

    // Also handle dynamic voice loading
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return (
    <Select
      onValueChange={(value) => {
        const selectedVoice = voices.find((v) => v.voice.name === value)?.voice;
        if (selectedVoice) {
          console.log("Voice selected:", selectedVoice.name);
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