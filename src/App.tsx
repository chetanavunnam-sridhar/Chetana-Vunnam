import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Info, 
  Settings, 
  FileText, 
  Calendar as CalendarIcon, 
  Phone, 
  User, 
  HelpCircle, 
  ShieldCheck,
  TrendingUp,
  Timer,
  LogOut,
  ChevronRight,
  Play
} from 'lucide-react';
import { View, Exam } from './types';
import { ExamSession } from './components/ExamSession';
import { ExamCalendar } from './components/ExamCalendar';
import { AdminDashboard } from './components/AdminDashboard';
import { cn } from './lib/utils';

const MOCK_EXAMS: Exam[] = [
  { id: '1', title: 'React Fundamentals', date: new Date(2026, 2, 25, 10, 0), duration: 60, status: 'upcoming' },
  { id: '2', title: 'Advanced CSS & Tailwind', date: new Date(2026, 2, 28, 14, 30), duration: 45, status: 'upcoming' },
  { id: '3', title: 'JavaScript Algorithms', date: new Date(2026, 2, 20, 9, 0), duration: 90, status: 'completed', score: 88 },
  { id: '4', title: 'Node.js Backend', date: new Date(2026, 3, 5, 11, 0), duration: 120, status: 'upcoming' },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'exams', label: 'Exams', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'login', label: 'Student Log', icon: User },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
    setCurrentView('exam-session');
  };

  const handleFinishExam = (score: number, switches: number) => {
    setCurrentView('exams');
    setActiveExam(null);
    alert(`Exam submitted! Score: ${score}%. Tab switches: ${switches}`);
  };

  if (currentView === 'exam-session' && activeExam) {
    return (
      <ExamSession 
        examTitle={activeExam.title} 
        onFinish={handleFinishExam}
        onCancel={() => setCurrentView('exams')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Header */}
      <header className="bg-gradient-to-br from-blue-900 to-blue-800 text-white pt-12 pb-8 px-4 shadow-xl">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-black mb-10 tracking-tight drop-shadow-md"
          >
            ✨ SECURE EXAM PORTAL
          </motion.h1>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={cn(
                  "group relative w-24 h-24 md:w-28 md:h-28 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2",
                  currentView === item.id 
                    ? "bg-white/20 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" 
                    : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40 hover:-translate-y-1"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <item.icon size={currentView === item.id ? 32 : 28} className="mb-2 transition-transform group-hover:scale-110" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto py-12 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'home' && (
              <div className="space-y-12">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center max-w-4xl mx-auto">
                  <h2 className="text-4xl font-black text-slate-900 mb-6">Welcome to the Future of Testing</h2>
                  <p className="text-xl text-slate-600 leading-relaxed mb-10">
                    Our AI-powered proctoring system ensures academic integrity while providing a seamless testing experience for students worldwide.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={() => setCurrentView('exams')}
                      className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                      Browse Exams <ChevronRight size={20} />
                    </button>
                    <button className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                      Learn More
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'AI Proctoring', desc: 'Real-time face detection and gaze tracking to prevent cheating.', icon: ShieldCheck },
                    { title: 'Tab Detection', desc: 'Automatic exam termination if students switch tabs or windows.', icon: AlertCircle },
                    { title: 'Detailed Analysis', desc: 'Comprehensive performance reports for both students and admins.', icon: TrendingUp },
                  ].map((feature, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                        <feature.icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'exams' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900">Available Exams</h2>
                  <div className="flex gap-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">4 Upcoming</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">12 Completed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_EXAMS.map((exam) => (
                    <div key={exam.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-600 flex-shrink-0">
                        <span className="text-xs font-bold uppercase">Mar</span>
                        <span className="text-3xl font-black leading-none">{exam.date.getDate()}</span>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{exam.title}</h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5"><Timer size={16} /> {exam.duration} mins</span>
                          <span className="flex items-center gap-1.5"><User size={16} /> 128 Registered</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {exam.status === 'upcoming' ? (
                          <button 
                            onClick={() => handleStartExam(exam)}
                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                          >
                            <Play size={18} fill="currentColor" /> Start Exam
                          </button>
                        ) : (
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Score</span>
                            <span className="text-2xl font-black text-green-600">{exam.score}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'calendar' && <ExamCalendar exams={MOCK_EXAMS} />}
            
            {currentView === 'admin' && <AdminDashboard />}

            {currentView === 'login' && (
              <div className="max-w-md mx-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-600/30">
                    <User size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Student Login</h2>
                  <p className="text-slate-500 mt-2">Enter your credentials to access the portal</p>
                </div>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setCurrentView('home'); }}>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Student ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. STU-12345" 
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-colors"
                      required
                    />
                  </div>
                  <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                    Login to Portal
                  </button>
                </form>
                <div className="mt-8 text-center">
                  <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Forgot your password?</a>
                </div>
              </div>
            )}

            {['about', 'services', 'contact', 'faq'].includes(currentView) && (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">{currentView} Page</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  This section is currently under development. Please check back later for more information about our {currentView}.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">✨ SECURE EXAM PORTAL</h3>
            <p className="text-slate-500 text-sm">© 2026 Secure Exam Portal. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><ShieldCheck size={24} /></a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><HelpCircle size={24} /></a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Settings size={24} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const AlertCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
