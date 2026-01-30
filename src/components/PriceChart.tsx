import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoryPoint {
  date: string;
  deluxeBeverage: number;
  refreshment: number;
  unlimitedDining: number;
  thrillWaterpark: number;
  hideawayBeach: number;
  cocoBeachClub: number;
  flashSale: string | null;
}

interface PriceChartProps {
  history: HistoryPoint[];
  targets: Record<string, number>;
  selectedProduct?: string;
}

const productColors: Record<string, { line: string; bg: string }> = {
  deluxeBeverage: { line: '#00e5ff', bg: 'rgba(0, 229, 255, 0.1)' },
  refreshment: { line: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
  unlimitedDining: { line: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  thrillWaterpark: { line: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  hideawayBeach: { line: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
  cocoBeachClub: { line: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
};

const productNames: Record<string, string> = {
  deluxeBeverage: 'Deluxe Beverage',
  refreshment: 'Refreshment',
  unlimitedDining: 'Unlimited Dining',
  thrillWaterpark: 'Thrill Waterpark',
  hideawayBeach: 'Hideaway Beach',
  cocoBeachClub: 'Coco Beach Club',
};

export default function PriceChart({ history, targets, selectedProduct = 'all' }: PriceChartProps) {
  const [activeProduct, setActiveProduct] = useState(selectedProduct);
  
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const labels = sortedHistory.map(h => {
    const date = new Date(h.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const getDataset = (productKey: string) => {
    const colors = productColors[productKey];
    return {
      label: productNames[productKey],
      data: sortedHistory.map(h => (h as any)[productKey]),
      borderColor: colors.line,
      backgroundColor: colors.bg,
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: colors.line,
      pointBorderColor: '#0f0f23',
      pointBorderWidth: 2,
    };
  };

  const getTargetLine = (productKey: string) => {
    const target = targets[productKey];
    if (!target) return null;
    return {
      label: `Target (${productNames[productKey]})`,
      data: Array(sortedHistory.length).fill(target),
      borderColor: 'rgba(16, 185, 129, 0.5)',
      borderDash: [5, 5],
      fill: false,
      tension: 0,
      pointRadius: 0,
    };
  };

  const datasets = activeProduct === 'all' 
    ? Object.keys(productColors).map(key => getDataset(key))
    : [getDataset(activeProduct), getTargetLine(activeProduct)].filter(Boolean);

  const data = { labels, datasets: datasets as any };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 35, 0.95)',
        titleColor: '#00e5ff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(0, 229, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
          afterBody: (context: any) => {
            const index = context[0].dataIndex;
            const flashSale = sortedHistory[index]?.flashSale;
            if (flashSale) {
              return `\n🏷️ ${flashSale}`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#64748b',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#64748b',
          callback: (value: number) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveProduct('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeProduct === 'all'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          All Products
        </button>
        {Object.keys(productNames).map(key => (
          <button
            key={key}
            onClick={() => setActiveProduct(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeProduct === key
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            style={{ 
              borderColor: activeProduct === key ? productColors[key].line : undefined 
            }}
          >
            {productNames[key]}
          </button>
        ))}
      </div>
      
      <div className="h-[400px]">
        <Line data={data} options={options} />
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <span className="w-4 h-0.5 bg-emerald-500 opacity-50" style={{ borderStyle: 'dashed' }}></span>
          Target price
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Data points
        </span>
      </div>
    </div>
  );
}
