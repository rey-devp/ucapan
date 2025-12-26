import React, { useState, useEffect, useRef } from 'react';
import { Cake } from './components/Cake';

function App() {
  const [candleLit, setCandleLit] = useState(true);
  const [micPermission, setMicPermission] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const rafId = useRef(null);

  // Ref to track state inside the animation frame closure
  const candleLitRef = useRef(true);

  useEffect(() => {
    candleLitRef.current = candleLit;
  }, [candleLit]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Smaller FFT size for faster reaction
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      detectBlow();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // Fallback or alert user
      alert("Gagal mengakses microphone. Pastikan izin diberikan! (Anda masih bisa tap kue untuk meniup)");
    }
  };

  const detectBlow = () => {
    // Check ref instead of state to avoid stale closure issues
    if (!candleLitRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    if (analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray);

      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;

      // Threshold for "blowing" - tweak as needed
      // Blowing usually produces a loud, sustained noise across frequencies
      if (average > 40) { // Threshold value
        setCandleLit(false);
        if (audioContextRef.current) audioContextRef.current.close();
        return;
      }
    }

    rafId.current = requestAnimationFrame(detectBlow);
  };

  // Allow tap as fallback or primary if user prefers
  const handleBlow = () => {
    if (candleLit) setCandleLit(false);
  };

  return (
    <div className="min-h-screen bg-matcha-100 flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans text-matcha-700 transition-colors duration-1000">

      {/* Content Wrapper */}
      <div className="flex flex-col items-center gap-12 z-10 w-full max-w-md">

        {/* Instruction */}
        <div className={`text-center transition-all duration-1000 transform ${candleLit ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 h-0 overflow-hidden'}`}>
          <p className="text-xl tracking-widest uppercase font-light animate-pulse text-matcha-500 mb-4">
            {micPermission ? "Tiup ke Microphone 🎤" : "Izinkan Microphone & Tiup 🎤"}
          </p>

          {!micPermission && (
            <button
              onClick={startListening}
              className="bg-matcha-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-matcha-700 transition-colors text-sm font-medium tracking-wide"
            >
              Aktifkan Mic
            </button>
          )}
        </div>

        {/* Cake - Tap is also enabling fallback */}
        <div className="cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 touch-manipulation">
          <Cake isCandleLit={candleLit} onBlow={handleBlow} />
        </div>

        {/* Greeting Card (Fades in) */}
        {!candleLit && (
          <div className="w-full max-w-sm mx-auto perspective-1000 animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-matcha-300 relative">
              {/* Card Header / Decoration */}
              <div className="h-4 bg-matcha-300 w-full"></div>
              <div className="p-8 text-center space-y-6">
                <div className="text-4xl">🎉🎂🎈</div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-matcha-700 font-serif">Happy Birthday!</h1>
                  <div className="h-1 w-20 bg-matcha-300 mx-auto rounded-full"></div>
                </div>
                <p className="text-gray-600 leading-relaxed font-light">
                  Selamat udah nyentuh kepala 2, semoga di tahun ini semua keinginan mu tecapai!<br />
                  <span className="text-sm text-matcha-500 font-bold mt-2 block">Wish u all the best!</span>
                </p>
              </div>
              {/* Card Footer */}
              <div className="bg-matcha-100 p-4 text-center">
                <button
                  onClick={() => window.location.reload()}
                  className="text-matcha-700 text-sm font-semibold hover:text-matcha-500 transition-colors"
                >
                  Ulangi Momen ↺
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-matcha-300 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-berry-300 rounded-full blur-3xl opacity-20 animate-blob animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-matcha-100 rounded-full blur-3xl opacity-40 animate-blob animation-delay-400 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
}

export default App;
