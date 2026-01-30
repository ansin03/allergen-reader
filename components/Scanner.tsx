
import React, { useRef, useState, useCallback } from 'react';

interface ScannerProps {
  onCapture: (base64: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Please allow camera access to scan labels.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        stopCamera();
        onCapture(base64);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      {!isCameraActive ? (
        <div className="flex flex-col items-center text-center space-y-8 py-12">
          <div className="w-48 h-48 bg-blue-50 rounded-full flex items-center justify-center border-2 border-dashed border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Ready to scan?</h2>
            <p className="text-gray-500 max-w-[250px] mx-auto mt-2">
              Point your camera at an ingredient label to detect allergens instantly.
            </p>
          </div>
          <button 
            onClick={startCamera}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 active:scale-95 transition-transform w-full"
          >
            Start Camera
          </button>
        </div>
      ) : (
        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-black shadow-2xl">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-white/50 rounded-2xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
            </div>
            <p className="mt-6 text-white text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md">
                Align label within frame
            </p>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-12 px-6">
            <button 
              onClick={stopCamera}
              className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button 
              onClick={captureImage}
              className="w-20 h-20 bg-white rounded-full border-4 border-blue-500/50 flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-black/30"
            >
              <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-300"></div>
            </button>
            <div className="w-14 h-14"></div> {/* Spacer */}
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Scanner;
