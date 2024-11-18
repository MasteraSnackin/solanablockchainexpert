import { useState } from "react";

export const useSpeech = () => {
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice>();

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice if one is selected
      if (currentVoice) {
        utterance.voice = currentVoice;
      }
      
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      console.log("Starting text-to-speech for:", text, "with voice:", currentVoice?.name);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-speech not supported in this browser");
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      console.log("Stopping text-to-speech");
      window.speechSynthesis.cancel();
    }
  };

  const setVoice = (voice: SpeechSynthesisVoice) => {
    console.log("Setting voice to:", voice.name);
    setCurrentVoice(voice);
  };

  return { speak, stopSpeaking, setVoice, currentVoice };
};