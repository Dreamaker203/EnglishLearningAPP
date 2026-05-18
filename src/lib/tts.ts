export function speakText(
  text: string,
  lang: string = "en-US",
  rate: number = 0.9
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      reject(new Error("Speech synthesis not supported"));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export async function speakWordByWord(
  words: string[],
  onWordStart?: (index: number) => void,
  lang: string = "en-US",
  rate: number = 0.8
): Promise<void> {
  for (let i = 0; i < words.length; i++) {
    onWordStart?.(i);
    await speakText(words[i], lang, rate);
    await new Promise((r) => setTimeout(r, 100));
  }
}

export function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  return window.speechSynthesis.getVoices();
}
