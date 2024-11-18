export const getDefaultVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined => {
  return (
    voices.find((voice) => voice.name === "Google UK English Female" && voice.lang === "en-GB") ||
    voices.find((voice) => voice.lang.startsWith("en")) ||
    voices[0]
  );
};

export const previewVoice = (voice: SpeechSynthesisVoice) => {
  const utterance = new SpeechSynthesisUtterance("This is a preview of the selected voice.");
  utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
};

export const groupVoicesByLanguage = (voices: SpeechSynthesisVoice[]) => {
  return voices.reduce((acc, voice) => {
    const lang = voice.lang.split('-')[0];
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);
};