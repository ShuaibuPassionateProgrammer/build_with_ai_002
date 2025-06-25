import Image from "next/image";
import TextToSpeech from "../components/TextToSpeech";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Text-to-Speech AI System</h1>
      <TextToSpeech />
      <footer className="mt-12 py-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-white rounded-t-3xl shadow-lg">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg font-semibold">
            This project was created during the Google Developer Group (GDG) event in Jalingo, Taraba State, Nigeria, as part of the 
            <span className="font-bold text-yellow-400"> ‘Build With AI’</span> initiative. The event brought together innovative minds to explore the power of AI in shaping the future.
          </p>
        </div>
        <div className="mt-4 text-sm text-gray-300">
          <p className="font-medium">
            Inspired by innovation at the Google GDG event. Powered by a community of creative minds pushing the boundaries of AI!
          </p>
          <a 
            href="#"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-yellow-400 hover:text-yellow-500 font-semibold transition-colors"
          >
            Join the movement → 
          </a>
        </div>
      </footer>
    </div>
  );
}