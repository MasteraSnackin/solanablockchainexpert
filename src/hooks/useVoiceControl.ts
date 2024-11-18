import { useState } from "react";
import { Toast } from "@/components/ui/use-toast";

interface UseVoiceControlProps {
  handleSendMessage: (message: string) => void;
  toast: Toast;
}

export const useVoiceControl = ({ handleSendMessage, toast }: UseVoiceControlProps) => {
  const [isListening, setIsListening] = useState(false);

  const toggleVoiceRecognition = () => {
    if (!isListening) {
      if (!('webkitSpeechRecognition' in window)) {
        toast({
          title: "Voice Input Error",
          description: "Voice recognition is not supported in your browser. Please use Chrome.",
          variant: "destructive",
        });
        return;
      }

      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("Voice recognition started");
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("Voice input received:", transcript);
        handleSendMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Voice recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "There was an error with voice recognition. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        console.log("Voice recognition ended");
        setIsListening(false);
      };

      recognition.start();
    } else {
      setIsListening(false);
    }
  };

  return {
    isListening,
    toggleVoiceRecognition,
  };
};