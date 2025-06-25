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
    <div className="max-w-xl w-full mx-auto p-6 sm:p-8 bg-gray-800 bg-opacity-60 backdrop-blur-md rounded-xl shadow-lg text-white">
      <div className="mt-6">
        <label htmlFor="voice" className="block mb-2 font-semibold text-base sm:text-lg">
          Enter some text:
        </label>
        <textarea
          className="w-full p-4 rounded-xl text-gray-100 text-base sm:text-lg resize-none shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-40 transition-all duration-300 border-2 border-gray-300 hover:border-indigo-500 active:border-indigo-600"
          rows={6}
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="mt-6">
        <label htmlFor="voice" className="block mb-2 font-semibold text-base sm:text-lg">
          Select Voice:
        </label>
        <select
          id="voice"
          className="w-full p-3 rounded-lg text-base sm:text-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-purple-300 border-2 border-gray-300 hover:border-indigo-500 active:border-indigo-600"
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
      <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <button
          className="w-full sm:w-auto bg-white text-indigo-700 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-100 disabled:opacity-50 transition duration-300"
          onClick={speak}
          disabled={isSpeaking && !isPaused}
          title="Listen"
        >
          ▶️ Listen
        </button>
        <button
          className="w-full sm:w-auto bg-white text-indigo-700 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-100 disabled:opacity-50 transition duration-300"
          onClick={togglePause}
          disabled={!isSpeaking}
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        <button
          className="w-full sm:w-auto bg-white text-indigo-700 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-100 disabled:opacity-50 transition duration-300"
          onClick={stop}
          disabled={!isSpeaking}
          title="Stop"
        >
          ⏹️ Stop
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;