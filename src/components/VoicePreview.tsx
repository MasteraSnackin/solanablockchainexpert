import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { previewVoice } from "@/utils/voiceUtils";

interface VoicePreviewProps {
  voice: SpeechSynthesisVoice;
}

export const VoicePreview = ({ voice }: VoicePreviewProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => previewVoice(voice)}
      className="ml-2"
      title="Preview voice"
    >
      <Play className="h-4 w-4" />
    </Button>
  );
};