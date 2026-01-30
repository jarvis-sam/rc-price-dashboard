interface FlashSaleBannerProps {
  name: string;
  dates: string;
  maxDiscount: string;
  endsAt: string;
  note?: string;
}

export default function FlashSaleBanner({ name, dates, maxDiscount, endsAt, note }: FlashSaleBannerProps) {
  const endDate = new Date(endsAt);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-gradient" 
           style={{ backgroundSize: '200% 200%' }}></div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 glow-cyan"></div>
      
      {/* Content */}
      <div className="relative glass border border-cyan-500/30 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-3xl animate-bounce-slow">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-bold uppercase animate-pulse">
                  Live Now
                </span>
                <span className="text-gray-500 text-sm">{dates}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {name}
              </h2>
              {note && (
                <p className="text-sm text-purple-400 mt-1">✨ {note}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">{maxDiscount}</div>
              <div className="text-sm text-gray-400">Max Discount</div>
            </div>
            
            <div className="h-12 w-px bg-white/10"></div>
            
            <div className="text-center">
              <div className={`text-4xl font-bold ${daysLeft <= 2 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                {daysLeft}
              </div>
              <div className="text-sm text-gray-400">Days Left</div>
            </div>
          </div>
        </div>
        
        {daysLeft <= 2 && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
            <span className="text-red-400 font-semibold">⚠️ Sale ending soon! Don't miss out!</span>
          </div>
        )}
      </div>
    </div>
  );
}
