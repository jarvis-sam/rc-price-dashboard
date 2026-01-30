import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return <div className="h-32" />;
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="glass rounded-xl p-3 sm:p-4 min-w-[60px] sm:min-w-[80px] glow-cyan">
        <span className="text-2xl sm:text-4xl font-bold text-cyan-400 font-mono">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-gray-400 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <TimeBlock value={timeLeft.days} label="Days" />
      <span className="text-2xl sm:text-3xl text-cyan-400 font-bold mt-[-20px]">:</span>
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <span className="text-2xl sm:text-3xl text-cyan-400 font-bold mt-[-20px]">:</span>
      <TimeBlock value={timeLeft.minutes} label="Mins" />
      <span className="text-2xl sm:text-3xl text-cyan-400 font-bold mt-[-20px] hidden sm:block">:</span>
      <div className="hidden sm:block">
        <TimeBlock value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}
