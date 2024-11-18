import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoicePreview } from "./VoicePreview";
import { getDefaultVoice, groupVoicesByLanguage } from "@/utils/voiceUtils";
import { VoiceControls } from "./VoiceControls";

interface VoiceSettingsProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  currentVoice: SpeechSynthesisVoice | null;
  onSpeedChange?: (speed: number) => void;
  onPitchChange?: (pitch: number) => void;
  onVolumeChange?: (volume: number) => void;
  speed?: number;
  pitch?: number;
  volume?: number;
}

export const VoiceSettings = ({ 
  onVoiceChange, 
  currentVoice,
  onSpeedChange = () => {},
  onPitchChange = () => {},
  onVolumeChange = () => {},
  speed = 1,
  pitch = 1,
  volume = 1
}: VoiceSettingsProps) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setIsLoading(false);
        if (!currentVoice) {
          const defaultVoice = getDefaultVoice(availableVoices);
          if (defaultVoice) onVoiceChange(defaultVoice);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [currentVoice, onVoiceChange]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 h-10 px-3 py-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-muted-foreground">Loading voices...</span>
      </div>
    );
  }

  const groupedVoices = groupVoicesByLanguage(voices);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          onValueChange={(value) => {
            const selectedVoice = voices.find((v) => v.name === value);
            if (selectedVoice) {
              onVoiceChange(selectedVoice);
              toast({
                title: "Voice Updated",
                description: `Voice changed to ${selectedVoice.name}`,
              });
            }
          }}
          value={currentVoice?.name}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(groupedVoices).map(([lang, langVoices]) => (
              <SelectGroup key={lang}>
                <SelectLabel>{new Intl.DisplayNames([lang], { type: 'language' }).of(lang)}</SelectLabel>
                {langVoices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        {currentVoice && <VoicePreview voice={currentVoice} />}
      </div>

      <VoiceControls
        speed={speed}
        pitch={pitch}
        volume={volume}
        onSpeedChange={([value]) => onSpeedChange(value)}
        onPitchChange={([value]) => onPitchChange(value)}
        onVolumeChange={([value]) => onVolumeChange(value)}
      />
    </div>
  );
};
