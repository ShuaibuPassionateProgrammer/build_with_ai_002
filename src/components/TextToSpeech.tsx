"use client";

import React, { useEffect, useState } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      console.log('Voices loaded:', availableVoices.length);
      
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setVoicesLoaded(true);
        
        // Try to find a good default voice (English if available)
        const defaultVoiceIndex = availableVoices.findIndex(voice => 
          voice.lang.startsWith('en') && voice.default
        ) || availableVoices.findIndex(voice => 
          voice.lang.startsWith('en')
        ) || 0;
        
        setSelectedVoiceIndex(defaultVoiceIndex);
      }
    };

    // Initial load
    loadVoices();

    // Set up event listener for when voices change
    const handleVoicesChanged = () => {
      console.log('Voices changed event fired');
      loadVoices();
    };

    speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    // Cleanup
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, []);

  const speak = () => {
    if (text.trim() === '' || voices.length === 0) return;

    // Cancel any existing speech
    speechSynthesis.cancel();

    const newUtterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices[selectedVoiceIndex];
    
    if (selectedVoice) {
      newUtterance.voice = selectedVoice;
    }
    
    // Set additional properties for better speech quality
    newUtterance.rate = 1;
    newUtterance.pitch = 1;
    newUtterance.volume = 1;

    newUtterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    newUtterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    newUtterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(newUtterance);
    setUtterance(newUtterance);
  };

  const togglePause = () => {
    if (isSpeaking) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
      } else {
        speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setUtterance(null);
  };

  const handleVoiceChange = (e: any) => {
    const newIndex = parseInt(e.target.value);
    setSelectedVoiceIndex(newIndex);
    console.log('Voice changed to:', voices[newIndex]?.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Text-to-Speech AI System
        </h1>

        <div className="mb-6">
          <label htmlFor="text-input" className="block text-gray-300 text-sm font-bold mb-2">
            Enter Text:
          </label>
          <textarea
            id="text-input"
            className="shadow-inner appearance-none border border-gray-700 rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-900 h-32 resize-none transition duration-300 ease-in-out focus:border-transparent"
            placeholder="Type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="voice-select" className="block text-gray-300 text-sm font-bold mb-2">
            Select Voice:
          </label>
          <div className="relative">
            {!voicesLoaded ? (
              <div className="bg-gray-900 border border-gray-700 text-gray-400 py-3 px-4 rounded">
                Loading voices...
              </div>
            ) : voices.length === 0 ? (
              <div className="bg-gray-900 border border-gray-700 text-gray-400 py-3 px-4 rounded">
                No voices available
              </div>
            ) : (
              <>
                <select
                  id="voice-select"
                  className="block appearance-none w-full bg-gray-900 border border-gray-700 text-gray-200 py-3 px-4 pr-8 rounded shadow-inner leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out cursor-pointer"
                  value={selectedVoiceIndex}
                  onChange={handleVoiceChange}
                >
                  {voices.map((voice, index) => (
                    <option key={`${voice.name}-${index}`} value={index}>
                      {voice.name} ({voice.lang}) {voice.default ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </>
            )}
          </div>
          {voicesLoaded && voices.length > 0 && (
            <p className="text-gray-400 text-xs mt-1">
              Selected: {voices[selectedVoiceIndex]?.name} ({voices[selectedVoiceIndex]?.lang})
            </p>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={speak}
            disabled={isSpeaking || !text.trim() || !voicesLoaded}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 6.343a1 1 0 010 1.414L13.707 9l.95.95a1 1 0 01-1.414 1.414L12.293 10.414l-.95.95a1 1 0 01-1.414-1.414l.95-.95-.95-.95a1 1 0 011.414-1.414l.95.95.95-.95a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            {isSpeaking ? 'Speaking...' : 'Listen'}
          </button>
          
          <button
            onClick={togglePause}
            disabled={!isSpeaking}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button
            onClick={stop}
            disabled={!isSpeaking && !isPaused}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}