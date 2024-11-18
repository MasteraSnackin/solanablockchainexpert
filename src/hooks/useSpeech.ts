import { useState } from "react";

export const useSpeech = () => {
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);

  const speak = (text: string, speed = 1, pitch = 1, volume = 1) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (currentVoice) {
        utterance.voice = currentVoice;
      }
      
      utterance.rate = speed;
      utterance.pitch = pitch;
      utterance.volume = volume;

      console.log("Starting text-to-speech:", {
        text,
        voice: currentVoice?.name,
        speed,
        pitch,
        volume
      });
      
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