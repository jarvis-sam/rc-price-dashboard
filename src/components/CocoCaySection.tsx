import AnimatedNumber from './AnimatedNumber';

interface CocoCayItem {
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  description: string;
  verdict: string;
  includes?: string[];
  isAdultsOnly?: boolean;
  recommendation: 'COMPRAR' | 'ESPERAR' | 'CONSIDERAR' | 'SKIP';
}

interface CocoCaySectionProps {
  items: CocoCayItem[];
}

export default function CocoCaySection({ items }: CocoCaySectionProps) {
  const getCardStyle = (rec: string) => {
    switch (rec) {
      case 'COMPRAR':
        return 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 pulse-urgent';
      case 'CONSIDERAR':
        return 'border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5';
      case 'SKIP':
        return 'border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5';
      default:
        return 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-600/5';
    }
  };

  const getBadge = (rec: string) => {
    switch (rec) {
      case 'COMPRAR':
        return { text: '🔥 BUY NOW', class: 'badge-buy' };
      case 'CONSIDERAR':
        return { text: '🤔 CONSIDER', class: 'badge-consider' };
      case 'SKIP':
        return { text: '❌ SKIP', class: 'badge-skip' };
      default:
        return { text: '⏳ WAIT', class: 'badge-wait' };
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🏝️</span>
        <div>
          <h3 className="text-2xl font-bold text-white">Perfect Day at CocoCay</h3>
          <p className="text-gray-400">Day 7 of your cruise • Private island paradise</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const badge = getBadge(item.recommendation);
          
          return (
            <div 
              key={item.name}
              className={`glass-hover rounded-xl p-5 border ${getCardStyle(item.recommendation)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-white text-lg">{item.name}</h4>
                  {item.isAdultsOnly && (
                    <span className="text-xs text-purple-400 flex items-center gap-1 mt-1">
                      👫 Adults Only
                    </span>
                  )}
                </div>
                <span className={`badge ${badge.class} whitespace-nowrap`}>
                  {badge.text}
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    $<AnimatedNumber value={item.price} />
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${item.originalPrice}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-sm font-semibold">
                    {item.discount} OFF
                  </span>
                  <span className="text-xs text-gray-500">per guest</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-400 mb-4">{item.description}</p>
              
              {/* Includes */}
              {item.includes && item.includes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Includes:</p>
                  <ul className="space-y-1">
                    {item.includes.map((inc, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Verdict */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm font-medium text-cyan-400">💡 {item.verdict}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
