import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Exam } from '../types';
import { cn } from '../lib/utils';

interface ExamCalendarProps {
  exams: Exam[];
}

export const ExamCalendar: React.FC<ExamCalendarProps> = ({ exams }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{format(currentMonth, 'MMMM yyyy')}</h2>
            <p className="text-sm text-slate-500">Exam Schedule & Deadlines</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Padding for start of month */}
          {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}

          {days.map(day => {
            const dayExams = exams.filter(e => isSameDay(new Date(e.date), day));
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "aspect-square p-2 rounded-xl border transition-all group relative",
                  isToday ? "border-blue-600 bg-blue-50/30" : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                )}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  isToday ? "text-blue-600" : "text-slate-700"
                )}>
                  {format(day, 'd')}
                </span>
                
                <div className="mt-1 space-y-1">
                  {dayExams.map(exam => (
                    <div 
                      key={exam.id}
                      className={cn(
                        "text-[10px] p-1 rounded-md truncate font-medium",
                        exam.status === 'upcoming' ? "bg-blue-100 text-blue-700 border border-blue-200" :
                        exam.status === 'completed' ? "bg-green-100 text-green-700 border border-green-200" :
                        "bg-orange-100 text-orange-700 border border-orange-200"
                      )}
                    >
                      {exam.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Upcoming Exams</h3>
        <div className="space-y-3">
          {exams.filter(e => e.status === 'upcoming').slice(0, 3).map(exam => (
            <div key={exam.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-600">
                  <span className="text-[10px] font-bold uppercase">{format(new Date(exam.date), 'MMM')}</span>
                  <span className="text-lg font-bold leading-none">{format(new Date(exam.date), 'dd')}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{exam.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Clock size={12} /> {exam.duration} mins</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>{format(new Date(exam.date), 'hh:mm a')}</span>
                  </div>
                </div>
              </div>
              <button className="text-blue-600 font-bold text-sm hover:underline">Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
