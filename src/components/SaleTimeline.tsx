interface Sale {
  name: string;
  date: string;
  action: string;
  isPast?: boolean;
  isCurrent?: boolean;
}

interface SaleTimelineProps {
  sales: Sale[];
  currentSaleEnds?: string;
}

export default function SaleTimeline({ sales, currentSaleEnds }: SaleTimelineProps) {
  const today = new Date();
  
  const sortedSales = [...sales].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getStatus = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'past', label: 'Passed' };
    if (diffDays === 0) return { status: 'current', label: 'Today!' };
    if (diffDays <= 7) return { status: 'soon', label: `${diffDays} days` };
    if (diffDays <= 30) return { status: 'upcoming', label: `${diffDays} days` };
    return { status: 'future', label: `${Math.floor(diffDays / 30)} months` };
  };

  const statusStyles: Record<string, { dot: string; line: string; text: string }> = {
    past: { dot: 'bg-gray-600', line: 'bg-gray-700', text: 'text-gray-500' },
    current: { dot: 'bg-cyan-400 animate-pulse', line: 'bg-cyan-500/50', text: 'text-cyan-400' },
    soon: { dot: 'bg-emerald-400', line: 'bg-emerald-500/50', text: 'text-emerald-400' },
    upcoming: { dot: 'bg-amber-400', line: 'bg-amber-500/30', text: 'text-amber-400' },
    future: { dot: 'bg-purple-400', line: 'bg-purple-500/30', text: 'text-purple-400' },
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        📅 Upcoming Sales Timeline
      </h3>
      
      {currentSaleEnds && (
        <div className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-medium">🔥 Current Sale Active</span>
            <span className="text-sm text-gray-400">
              Ends: {new Date(currentSaleEnds).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      )}
      
      <div className="relative">
        {sortedSales.map((sale, index) => {
          const { status, label } = getStatus(sale.date);
          const style = statusStyles[status];
          const isLast = index === sortedSales.length - 1;
          
          return (
            <div key={sale.name} className="relative pl-8 pb-8 last:pb-0">
              {/* Timeline line */}
              {!isLast && (
                <div className={`absolute left-[11px] top-6 w-0.5 h-full ${style.line}`}></div>
              )}
              
              {/* Timeline dot */}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${style.dot} flex items-center justify-center`}>
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
              </div>
              
              {/* Content */}
              <div className="glass-hover rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-white">{sale.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${style.text} bg-white/5`}>
                    {label}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {new Date(sale.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-cyan-400">
                  📋 {sale.action}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
