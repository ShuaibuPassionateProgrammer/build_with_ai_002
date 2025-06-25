import TextToSpeech from "../components/TextToSpeech";

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-black">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-white text-center">Text-to-Speech AI System</h1>
      <TextToSpeech />
      <footer className="w-full mt-12 py-8 sm:py-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-white rounded-t-3xl shadow-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-0">
          <p className="text-base sm:text-lg font-semibold">
            This project was created during the Google Developer Group (GDG) event in Jalingo, Taraba State, Nigeria, as part of the
            <span className="font-bold text-yellow-400"> ‘Build With AI’</span> initiative. The event brought together innovative minds to explore the power of AI in shaping the future.
          </p>
        </div>
        <div className="mt-4 text-sm sm:text-base text-gray-300 px-4 sm:px-0">
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