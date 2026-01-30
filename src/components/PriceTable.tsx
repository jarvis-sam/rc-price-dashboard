import { useState } from 'react';
import AnimatedNumber from './AnimatedNumber';

interface PriceItem {
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  target: number;
  recordLow: number;
  recordDate: string;
  recommendation: 'COMPRAR' | 'ESPERAR' | 'CONSIDERAR' | 'SKIP';
  note?: string;
  perDay?: boolean;
}

interface PriceTableProps {
  prices: PriceItem[];
}

export default function PriceTable({ prices }: PriceTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'discount' | 'recommendation'>('recommendation');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const getRecommendationBadge = (rec: string) => {
    const badges: Record<string, { class: string; icon: string }> = {
      'COMPRAR': { class: 'badge-buy pulse-urgent', icon: '🔥' },
      'ESPERAR': { class: 'badge-wait', icon: '⏳' },
      'CONSIDERAR': { class: 'badge-consider', icon: '🤔' },
      'SKIP': { class: 'badge-skip', icon: '❌' },
    };
    return badges[rec] || badges['ESPERAR'];
  };

  const getVsTarget = (price: number, target: number) => {
    const diff = ((price - target) / target) * 100;
    if (diff <= 0) return { text: `${Math.abs(diff).toFixed(0)}% bajo target`, class: 'text-emerald-400' };
    if (diff <= 20) return { text: `${diff.toFixed(0)}% sobre target`, class: 'text-amber-400' };
    return { text: `${diff.toFixed(0)}% sobre target`, class: 'text-red-400' };
  };

  const sortedPrices = [...prices].sort((a, b) => {
    const recOrder = { 'COMPRAR': 1, 'CONSIDERAR': 2, 'ESPERAR': 3, 'SKIP': 4 };
    
    if (sortBy === 'recommendation') {
      const diff = recOrder[a.recommendation] - recOrder[b.recommendation];
      return sortDir === 'asc' ? diff : -diff;
    }
    if (sortBy === 'price') {
      return sortDir === 'asc' ? a.price - b.price : b.price - a.price;
    }
    if (sortBy === 'discount') {
      const aDisc = parseInt(a.discount);
      const bDisc = parseInt(b.discount);
      return sortDir === 'asc' ? bDisc - aDisc : aDisc - bDisc;
    }
    return sortDir === 'asc' 
      ? a.name.localeCompare(b.name) 
      : b.name.localeCompare(a.name);
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ column }: { column: typeof sortBy }) => (
    <span className="ml-1 opacity-50">
      {sortBy === column ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-glass">
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:text-cyan-300 transition-colors"
                onClick={() => handleSort('name')}
              >
                Producto <SortIcon column="name" />
              </th>
              <th 
                className="cursor-pointer hover:text-cyan-300 transition-colors"
                onClick={() => handleSort('price')}
              >
                Precio Actual <SortIcon column="price" />
              </th>
              <th>Original</th>
              <th 
                className="cursor-pointer hover:text-cyan-300 transition-colors"
                onClick={() => handleSort('discount')}
              >
                Descuento <SortIcon column="discount" />
              </th>
              <th>Target</th>
              <th>Record Low</th>
              <th>vs Target</th>
              <th 
                className="cursor-pointer hover:text-cyan-300 transition-colors"
                onClick={() => handleSort('recommendation')}
              >
                Acción <SortIcon column="recommendation" />
              </th>
            </tr>
          </thead>
          <tbody className="stagger-children">
            {sortedPrices.map((item, index) => {
              const badge = getRecommendationBadge(item.recommendation);
              const vsTarget = getVsTarget(item.price, item.target);
              
              return (
                <tr 
                  key={item.name}
                  className={`${item.recommendation === 'COMPRAR' ? 'bg-emerald-500/5' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{item.name}</span>
                      {item.perDay && (
                        <span className="text-xs text-gray-500">per guest/day</span>
                      )}
                      {item.note && (
                        <span className="text-xs text-purple-400 mt-1">{item.note}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="text-lg font-bold text-white">
                      $<AnimatedNumber value={item.price} className="text-lg" />
                    </span>
                  </td>
                  <td>
                    <span className="text-gray-500 line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 font-semibold">
                      {item.discount}
                    </span>
                  </td>
                  <td>
                    <span className="text-gray-400">${item.target}</span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-emerald-400 font-medium">${item.recordLow}</span>
                      <span className="text-xs text-gray-600">{item.recordDate}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`font-medium ${vsTarget.class}`}>
                      {vsTarget.text}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${badge.class}`}>
                      {badge.icon} {item.recommendation}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
