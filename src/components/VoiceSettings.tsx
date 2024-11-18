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
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { VoicePreview } from "./VoicePreview";
import { getDefaultVoice, groupVoicesByLanguage } from "@/utils/voiceUtils";

interface Voice {
  name: string;
  voice: SpeechSynthesisVoice;
}

interface VoiceSettingsProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  currentVoice?: SpeechSynthesisVoice;
}

const VoiceSettings = ({ onVoiceChange, currentVoice }: VoiceSettingsProps) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const loadVoices = React.useCallback(() => {
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
      if (availableVoices.length === 0 && retryCount < 3) {
        // Retry loading voices after a delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadVoices();
        }, 1000);
        return;
      }

      const voiceOptions = availableVoices.map((voice) => ({
        name: `${voice.name} (${voice.lang})`,
        voice: voice,
      }));
      
      // Set default voice if none is selected
      if (!currentVoice) {
        const defaultVoice = getDefaultVoice(availableVoices);
        if (defaultVoice) {
          onVoiceChange(defaultVoice);
        }
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
        description: "Failed to load text-to-speech voices. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [onVoiceChange, currentVoice, toast, retryCount]);

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [loadVoices]);

  const handleRetry = () => {
    setIsLoading(true);
    setRetryCount(0);
    loadVoices();
  };

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

  const groupedVoices = groupVoicesByLanguage(voices.map(v => v.voice));

  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={(value) => {
          const selectedVoice = voices.find((v) => v.voice.name === value)?.voice;
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
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRetry}
        title="Retry loading voices"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VoiceSettings;