import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const loadVoices = () => {
      try {
        if (!('speechSynthesis' in window)) {
          toast({
            title: "Browser Not Supported",
            description: "Text-to-speech is not supported in your browser. Please try Chrome or Edge.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
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
          console.log("Setting default voice to Google UK English Female");
          onVoiceChange(defaultVoice);
        }
        
        setVoices(voiceOptions);
        setIsLoading(false);

        if (voiceOptions.length === 0) {
          toast({
            title: "No Voices Available",
            description: "No text-to-speech voices were found. Try refreshing the page.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading voices:", error);
        toast({
          title: "Error Loading Voices",
          description: "Failed to load text-to-speech voices. Please refresh the page.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Also handle dynamic voice loading
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [onVoiceChange, currentVoice, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 h-10 px-3 py-2 text-sm border rounded-md">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-muted-foreground">Loading voices...</span>
      </div>
    );
  }

  if (!('speechSynthesis' in window)) {
    return (
      <div className="h-10 px-3 py-2 text-sm border rounded-md text-muted-foreground">
        Text-to-speech not supported
      </div>
    );
  }

  return (
    <Select
      onValueChange={(value) => {
        const selectedVoice = voices.find((v) => v.voice.name === value)?.voice;
        if (selectedVoice) {
          console.log("Voice selected:", selectedVoice.name);
          onVoiceChange(selectedVoice);
          toast({
            title: "Voice Updated",
            description: `Voice changed to ${selectedVoice.name}`,
          });
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