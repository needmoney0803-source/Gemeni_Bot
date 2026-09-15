import React, { useState } from 'react';
import { Instrument, OptionStrike } from '../types';
import { Layers, ArrowUpRight, ArrowDownRight, Eye, ShieldCheck } from 'lucide-react';

interface OptionChainProps {
  instruments: Instrument[];
  selectedInstrument: Instrument;
  onSelectInstrument: (inst: Instrument) => void;
  optionChain: OptionStrike[];
  onExecuteStrikeTrade: (strike: OptionStrike, type: 'CE' | 'PE') => void;
}

export const OptionChain: React.FC<OptionChainProps> = ({
  instruments,
  selectedInstrument,
  onSelectInstrument,
  optionChain,
  onExecuteStrikeTrade,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'ITM' | 'ATM' | 'OTM'>('ALL');

  const spot = selectedInstrument.spot_price;

  // Find ATM strike
  const sortedChain = [...optionChain].sort((a, b) => a.strike_price - b.strike_price);

  return (
    <div className="space-y-4">
      
      {/* Top Controls Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Instrument Selector */}
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-slate-100 text-sm">Option Chain Matrix:</span>
          <select
            value={selectedInstrument.symbol}
            onChange={(e) => {
              const match = instruments.find(i => i.symbol === e.target.value);
              if (match) onSelectInstrument(match);
            }}
            className="bg-slate-950 border border-slate-700 text-cyan-400 rounded-lg px-3 py-1.5 text-xs font-bold font-mono focus:outline-none"
          >
            {instruments.map((inst) => (
              <option key={inst.id} value={inst.symbol}>
                {inst.symbol} (Spot ₹{inst.spot_price.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-1.5 text-xs font-mono">
          {(['ALL', 'ITM', 'ATM', 'OTM'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Expiry Badge */}
        <div className="text-xs text-slate-400 font-mono">
          Expiry: <span className="text-slate-200 font-bold">{selectedInstrument.expiry_date}</span>
        </div>

      </div>

      {/* Option Chain Table (CE Left | Strike Middle | PE Right) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            <tr>
              <th colSpan={4} className="py-2.5 px-3 text-center text-emerald-400 bg-emerald-950/20 border-r border-slate-800">
                CALL OPTIONS (CE)
              </th>
              <th className="py-2.5 px-3 text-center text-slate-200 font-bold bg-slate-900">
                STRIKE
              </th>
              <th colSpan={4} className="py-2.5 px-3 text-center text-rose-400 bg-rose-950/20 border-l border-slate-800">
                PUT OPTIONS (PE)
              </th>
            </tr>
            <tr className="border-t border-slate-800 text-[10px] text-slate-400">
              {/* CE Headers */}
              <th className="py-2 px-3 text-right">OI (Lakhs)</th>
              <th className="py-2 px-3 text-right">IV %</th>
              <th className="py-2 px-3 text-right">Delta</th>
              <th className="py-2 px-3 text-right border-r border-slate-800">LTP (₹)</th>
              
              {/* Strike Header */}
              <th className="py-2 px-3 text-center font-bold text-slate-300">STRIKE</th>
              
              {/* PE Headers */}
              <th className="py-2 px-3 text-left border-l border-slate-800">LTP (₹)</th>
              <th className="py-2 px-3 text-left">Delta</th>
              <th className="py-2 px-3 text-left">IV %</th>
              <th className="py-2 px-3 text-left">OI (Lakhs)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
            {sortedChain.map((row) => {
              const isAtm = Math.abs(row.strike_price - spot) < 50;
              const isCeItm = row.strike_price < spot;
              const isPeItm = row.strike_price > spot;

              if (filterType === 'ITM' && !isCeItm && !isPeItm) return null;
              if (filterType === 'ATM' && !isAtm) return null;
              if (filterType === 'OTM' && (isCeItm || isPeItm)) return null;

              return (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-800/60 transition-colors ${
                    isAtm ? 'bg-cyan-950/20 border-y-2 border-cyan-500/30' : ''
                  }`}
                >
                  {/* CE Side */}
                  <td className={`py-2 px-3 text-right ${isCeItm ? 'bg-emerald-950/10' : ''}`}>
                    <span className="text-slate-400 font-bold">{(row.ce_oi / 100000).toFixed(2)}</span>
                  </td>
                  <td className={`py-2 px-3 text-right text-slate-400 ${isCeItm ? 'bg-emerald-950/10' : ''}`}>
                    {row.ce_iv}%
                  </td>
                  <td className={`py-2 px-3 text-right text-emerald-400 font-bold ${isCeItm ? 'bg-emerald-950/10' : ''}`}>
                    {row.ce_delta}
                  </td>
                  <td className={`py-2 px-3 text-right font-bold border-r border-slate-800 ${isCeItm ? 'bg-emerald-950/20 text-emerald-300' : 'text-slate-200'}`}>
                    <button
                      onClick={() => onExecuteStrikeTrade(row, 'CE')}
                      className="hover:underline text-emerald-400 font-bold cursor-pointer"
                      title="Trade Call Option"
                    >
                      ₹{row.ce_ltp}
                    </button>
                  </td>

                  {/* Strike Price */}
                  <td className={`py-2 px-3 text-center font-extrabold text-sm ${
                    isAtm ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-100'
                  }`}>
                    {row.strike_price}
                    {isAtm && <span className="block text-[8px] text-cyan-400 font-sans uppercase font-normal">ATM</span>}
                  </td>

                  {/* PE Side */}
                  <td className={`py-2 px-3 text-left font-bold border-l border-slate-800 ${isPeItm ? 'bg-rose-950/20 text-rose-300' : 'text-slate-200'}`}>
                    <button
                      onClick={() => onExecuteStrikeTrade(row, 'PE')}
                      className="hover:underline text-rose-400 font-bold cursor-pointer"
                      title="Trade Put Option"
                    >
                      ₹{row.pe_ltp}
                    </button>
                  </td>
                  <td className={`py-2 px-3 text-left text-rose-400 font-bold ${isPeItm ? 'bg-rose-950/10' : ''}`}>
                    {row.pe_delta}
                  </td>
                  <td className={`py-2 px-3 text-left text-slate-400 ${isPeItm ? 'bg-rose-950/10' : ''}`}>
                    {row.pe_iv}%
                  </td>
                  <td className={`py-2 px-3 text-left ${isPeItm ? 'bg-rose-950/10' : ''}`}>
                    <span className="text-slate-400 font-bold">{(row.pe_oi / 100000).toFixed(2)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
