"use client";

import React, { useEffect, useState } from 'react';

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    if (text.trim() === '') return;

    const newUtterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      newUtterance.voice = voice;
    }

    newUtterance.onstart = () => setIsSpeaking(true);
    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(newUtterance);
  };

  const togglePause = () => {
    if (!speechSynthesis.speaking) return;
    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stop = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">Text to Speech</h1>
      <textarea
        className="w-full p-3 rounded-md text-black"
        rows={6}
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4">
        <label htmlFor="voice" className="block mb-2 font-semibold">
          Select Voice:
        </label>
        <select
          id="voice"
          className="w-full p-2 rounded-md text-black"
          value={selectedVoice}
          onChange={handleVoiceChange}
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <button
          className="bg-white text-purple-700 font-bold py-2 px-4 rounded hover:bg-purple-100 disabled:opacity-50"
          onClick={speak}
          disabled={isSpeaking && !isPaused}
          title="Listen"
        >
          ▶️
        </button>
        <button
          className="bg-white text-purple-700 font-bold py-2 px-4 rounded hover:bg-purple-100 disabled:opacity-50"
          onClick={togglePause}
          disabled={!isSpeaking}
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>
        <button
          className="bg-white text-purple-700 font-bold py-2 px-4 rounded hover:bg-purple-100 disabled:opacity-50"
          onClick={stop}
          disabled={!isSpeaking}
          title="Stop"
        >
          ⏹️
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;