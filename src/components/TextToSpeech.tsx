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
          Enter Text:
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
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={speak}
          disabled={isSpeaking && !isPaused}
          title="Listen"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 6.343a1 1 0 010 1.414L13.707 9l.95.95a1 1 0 01-1.414 1.414L12.293 10.414l-.95.95a1 1 0 01-1.414-1.414l.95-.95-.95-.95a1 1 0 011.414-1.414l.95.95.95-.95a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          {isSpeaking ? 'Speaking...' : 'Listen'}
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={togglePause}
          disabled={!isSpeaking}
          title={isPaused ? "Resume" : "Pause"}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={stop}
          disabled={!isSpeaking}
          title="Stop"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          Stop
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;