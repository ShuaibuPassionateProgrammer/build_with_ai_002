import Image from "next/image";
import TextToSpeech from "../components/TextToSpeech";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">AI Text-to-Speech Converter</h1>
      <TextToSpeech />
    </div>
  );
}