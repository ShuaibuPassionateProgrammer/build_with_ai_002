// Type definitions for Web Speech API
interface Window {
  SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
  speechSynthesis: SpeechSynthesis;
}

interface SpeechSynthesis {
  speaking: boolean;
  paused: boolean;
  pending: boolean;
  onvoiceschanged: () => void;
  getVoices(): SpeechSynthesisVoice[];
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  pause(): void;
  resume(): void;
}

interface SpeechSynthesisVoice {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
}

interface SpeechSynthesisUtterance extends EventTarget {
  lang: string;
  pitch: number;
  rate: number;
  text: string;
  voice: SpeechSynthesisVoice | null;
  volume: number;
  onboundary: (event: SpeechSynthesisEvent) => void;
  onend: (event: SpeechSynthesisEvent) => void;
  onerror: (event: SpeechSynthesisEvent) => void;
  onmark: (event: SpeechSynthesisEvent) => void;
  onpause: (event: SpeechSynthesisEvent) => void;
  onresume: (event: SpeechSynthesisEvent) => void;
  onstart: (event: SpeechSynthesisEvent) => void;
}

interface SpeechSynthesisEvent extends Event {
  charIndex: number;
  elapsedTime: number;
  name: string;
  utterance: SpeechSynthesisUtterance;
}