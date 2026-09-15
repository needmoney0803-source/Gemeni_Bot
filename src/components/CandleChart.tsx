import React from 'react';

interface CandleChartProps {
  symbol: string;
  spotPrice: number;
  changePct: number;
}

export const CandleChart: React.FC<CandleChartProps> = ({ symbol, spotPrice, changePct }) => {
  // Generate stylized technical candlestick data points around spotPrice
  const isUp = changePct >= 0;
  const base = spotPrice;
  const step = base * 0.0015;

  const dataPoints = [
    { o: base - step * 4, h: base - step * 2, l: base - step * 5, c: base - step * 2.5 },
    { o: base - step * 2.5, h: base - step * 1, l: base - step * 3.5, c: base - step * 1.2 },
    { o: base - step * 1.2, h: base + step * 0.5, l: base - step * 2, c: base - step * 0.5 },
    { o: base - step * 0.5, h: base + step * 1.5, l: base - step * 1, c: base + step * 1.0 },
    { o: base + step * 1.0, h: base + step * 2.5, l: base + step * 0.5, c: base + step * 1.8 },
    { o: base + step * 1.8, h: base + step * 3.8, l: base + step * 1.2, c: base + step * 3.2 },
    { o: base + step * 3.2, h: base + step * 4.5, l: base + step * 2.8, c: base + (isUp ? step * 4.0 : step * 1.5) },
  ];

  const minL = Math.min(...dataPoints.map(d => d.l));
  const maxH = Math.max(...dataPoints.map(d => d.h));
  const range = maxH - minL || 1;

  const height = 180;
  const width = 480;
  const candleWidth = 32;
  const gap = 30;

  const getY = (val: number) => {
    return height - ((val - minL) / range) * (height - 30) - 15;
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm text-slate-100">{symbol} Intraday 15m Chart</span>
          <span className="text-xs text-slate-400 font-mono">VWAP & Supertrend Overlay</span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-emerald-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></span>
            Supertrend (24,750)
          </span>
          <span className="text-cyan-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1"></span>
            VWAP ({Math.round(spotPrice * 0.999).toLocaleString('en-IN')})
          </span>
        </div>
      </div>

      <div className="relative w-full h-[180px] bg-slate-900/60 rounded-lg p-2 overflow-hidden border border-slate-800/80">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Background Grid */}
          <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#1e293b" strokeDasharray="3 3" />

          {/* VWAP Trend Line */}
          <path
            d={`M 20 ${getY(dataPoints[0].c)} Q 120 ${getY(dataPoints[2].c)} 240 ${getY(dataPoints[4].c)} T ${width - 20} ${getY(dataPoints[6].c)}`}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Candlesticks */}
          {dataPoints.map((d, idx) => {
            const x = 30 + idx * (candleWidth + gap);
            const yOpen = getY(d.o);
            const yClose = getY(d.c);
            const yHigh = getY(d.h);
            const yLow = getY(d.l);
            const isBull = d.c >= d.o;
            const top = Math.min(yOpen, yClose);
            const candleH = Math.max(Math.abs(yClose - yOpen), 3);

            return (
              <g key={idx}>
                {/* High/Low Wick */}
                <line
                  x1={x + candleWidth / 2}
                  y1={yHigh}
                  x2={x + candleWidth / 2}
                  y2={yLow}
                  stroke={isBull ? '#34d399' : '#f87171'}
                  strokeWidth="1.5"
                />
                {/* Body */}
                <rect
                  x={x}
                  y={top}
                  width={candleWidth}
                  height={candleH}
                  fill={isBull ? '#10b981' : '#ef4444'}
                  rx="1"
                  className="transition-all hover:opacity-80"
                />
              </g>
            );
          })}
        </svg>

        {/* Current Price Banner */}
        <div className="absolute right-3 top-3 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded text-xs font-mono font-bold text-slate-100 shadow">
          LTP: ₹{spotPrice.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
};
