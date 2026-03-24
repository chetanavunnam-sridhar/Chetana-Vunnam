import React, { useState, useEffect, useRef } from 'react';
import { Camera, AlertTriangle, XCircle, CheckCircle, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExamSessionProps {
  examTitle: string;
  onFinish: (score: number, tabSwitches: number) => void;
  onCancel: () => void;
}

export const ExamSession: React.FC<ExamSessionProps> = ({ examTitle, onFinish, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [tabSwitches, setTabSwitches] = useState(0);
  const [isExamActive, setIsExamActive] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera setup
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };
    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isExamActive) {
        setTabSwitches(prev => prev + 1);
        setShowWarning(true);
        
        // If too many switches, auto-close
        if (tabSwitches >= 2) {
          setIsExamActive(false);
          alert("Exam terminated due to multiple tab switches.");
          onFinish(0, tabSwitches + 1);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [tabSwitches, isExamActive, onFinish]);

  // Timer
  useEffect(() => {
    if (!isExamActive) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          onFinish(75, tabSwitches); // Mock score
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamActive, onFinish, tabSwitches]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-white font-bold text-xl">{examTitle}</h2>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Timer size={14} />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm font-medium border border-red-500/20 flex items-center gap-2">
            <AlertTriangle size={14} />
            <span>Violations: {tabSwitches}/3</span>
          </div>
          <button 
            onClick={() => onFinish(85, tabSwitches)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4">Question 1: What is the primary purpose of React Hooks?</h3>
              <div className="space-y-3">
                {['To manage state in class components', 'To use state and other React features in functional components', 'To handle DOM manipulation directly', 'To replace Redux entirely'].map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="radio" name="q1" className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4">Question 2: Explain the Virtual DOM.</h3>
              <textarea 
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Type your answer here..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Proctoring Sidebar */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 flex flex-col gap-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-600">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 rounded text-[10px] text-white font-bold uppercase flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Live Proctoring
            </div>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
              <Camera size={16} className="text-blue-400" />
              AI Proctoring Status
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-slate-300">
                <span>Face Detected</span>
                <CheckCircle size={14} className="text-green-500" />
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Single Person</span>
                <CheckCircle size={14} className="text-green-500" />
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Gaze Tracking</span>
                <CheckCircle size={14} className="text-green-500" />
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Tab Focus</span>
                <CheckCircle size={14} className="text-green-500" />
              </li>
            </ul>
          </div>

          <div className="mt-auto bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
            <p className="text-yellow-500 text-xs font-medium leading-relaxed">
              Warning: Switching tabs or minimizing this window will be recorded as a violation. 3 violations will result in automatic submission.
            </p>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Tab Switch Detected!</h3>
              <p className="text-slate-600 mb-8">
                You have switched tabs. This violation has been recorded. You have {3 - tabSwitches} attempts remaining before termination.
              </p>
              <button 
                onClick={() => setShowWarning(false)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                I Understand, Resume Exam
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
