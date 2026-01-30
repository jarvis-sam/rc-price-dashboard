interface RecommendationCardProps {
  type: 'urgent' | 'wait' | 'verify';
  title: string;
  items: string[];
  icon: string;
}

export default function RecommendationCard({ type, title, items, icon }: RecommendationCardProps) {
  const styles = {
    urgent: {
      bg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      glow: 'glow-green',
      iconBg: 'bg-emerald-500/20',
      textColor: 'text-emerald-400',
    },
    wait: {
      bg: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/30',
      glow: '',
      iconBg: 'bg-amber-500/20',
      textColor: 'text-amber-400',
    },
    verify: {
      bg: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/30',
      glow: '',
      iconBg: 'bg-purple-500/20',
      textColor: 'text-purple-400',
    },
  };

  const style = styles[type];

  return (
    <div className={`glass-hover rounded-2xl p-6 ${style.bg} border ${style.border} ${style.glow} ${type === 'urgent' ? 'pulse-urgent' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <h3 className={`text-lg font-bold ${style.textColor}`}>{title}</h3>
      </div>
      
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li 
            key={index}
            className="flex items-start gap-3 text-gray-300"
          >
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${style.textColor.replace('text-', 'bg-')}`}></span>
            <span className="text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
