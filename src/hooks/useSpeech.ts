export const useSpeech = () => {
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      console.log("Starting text-to-speech for:", text);
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

  return { speak, stopSpeaking };
};