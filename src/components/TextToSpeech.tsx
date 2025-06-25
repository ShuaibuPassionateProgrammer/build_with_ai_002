"use client";

import { useState, useEffect } from 'react';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [speaking, setSpeaking] = useState(false);

  // Load available voices when component mounts
  useEffect(() => {
    const synth = window.speechSynthesis;
    
    // Function to load and set available voices
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      
      // Set default voice (first one)
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    // Load voices initially
    loadVoices();
    
    // Chrome loads voices asynchronously, so we need this event
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    // Cleanup function
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  // Handle speech synthesis
  const speak = () => {
    const synth = window.speechSynthesis;
    
    // Cancel any ongoing speech
    if (synth.speaking) {
      synth.cancel();
    }

    // Create a new utterance with the input text
    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Set the selected voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      newUtterance.voice = voice;
    }

    // Set event handlers
    newUtterance.onstart = () => setSpeaking(true);
    newUtterance.onend = () => setSpeaking(false);
    newUtterance.onpause = () => setIsPaused(true);
    newUtterance.onresume = () => setIsPaused(false);

    // Store the utterance in state
    setUtterance(newUtterance);
    
    // Start speaking
    synth.speak(newUtterance);
  };

  // Handle pause/resume
  const togglePause = () => {
    const synth = window.speechSynthesis;
    
    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    }
  };

  // Handle stop
  const stop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setSpeaking(false);
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Text to Speech Converter</h2>
      
      {/* Text input area */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="text-input" className="font-medium">Enter your text:</label>
        <textarea
          id="text-input"
          className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Type something here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      
      {/* Voice selection */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="voice-select" className="font-medium">Select Voice:</label>
        <select
          id="voice-select"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
      
      {/* Control buttons */}
      <div className="flex space-x-2 justify-center">
        <button
          onClick={speak}
          disabled={!text || speaking}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Listen
        </button>
        
        {speaking && (
          <>
            <button
              onClick={togglePause}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            
            <button
              onClick={stop}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}