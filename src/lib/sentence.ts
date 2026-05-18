export function tokenizeSentence(sentence: string): string[] {
  return sentence
    .replace(/([.!?,;:])/g, " $1")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

export function createChunks(words: string[], chunkSize: number = 3): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize));
  }
  return chunks;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function isPunctuation(word: string): boolean {
  return /^[.!?,;:]$/.test(word);
}

export function joinWords(words: string[]): string {
  let result = "";
  for (let i = 0; i < words.length; i++) {
    if (i > 0 && !isPunctuation(words[i])) {
      result += " ";
    }
    result += words[i];
  }
  return result;
}

export function parseSentencesFromText(text: string): { english: string; chinese: string }[] {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const sentences: { english: string; chinese: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const separatorIndex = trimmed.search(/[|｜\t]/);
    if (separatorIndex >= 0) {
      const english = trimmed.slice(0, separatorIndex).trim();
      const chinese = trimmed.slice(separatorIndex + 1).trim();
      if (english && chinese) {
        sentences.push({ english, chinese });
        continue;
      }
    }

    if (/[一-鿿]/.test(trimmed)) {
      const enParts: string[] = [];
      const zhParts: string[] = [];
      const parts = trimmed.split(/(?<=[.!?])\s+/);
      for (const part of parts) {
        if (/[一-鿿]/.test(part) && !/^[a-zA-Z]/.test(part)) {
          zhParts.push(part);
        } else {
          enParts.push(part);
        }
      }
      if (enParts.length && zhParts.length) {
        sentences.push({
          english: enParts.join(" ").trim(),
          chinese: zhParts.join(" ").trim(),
        });
        continue;
      }
    }

    sentences.push({ english: trimmed, chinese: "" });
  }

  return sentences;
}
