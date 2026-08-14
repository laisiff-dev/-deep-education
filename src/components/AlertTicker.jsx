import React from 'react';
import { ShieldAlert, AlertTriangle, ChevronRight, BellRing } from 'lucide-react';

export default function AlertTicker({ criticalItems, onSelectIndicator }) {
  if (!criticalItems || criticalItems.length === 0) return null;

  return (
    <div className="bg-rose-950/70 border-y border-rose-500/40 px-4 py-2 flex items-center gap-3 overflow-hidden shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs shrink-0 animate-pulse shadow-md shadow-rose-900/50">
        <BellRing className="w-3.5 h-3.5" />
        <span>即時落後告警 ({criticalItems.length}項)</span>
      </div>

      <div className="ticker-wrap flex-1 text-xs">
        <div className="ticker-content flex items-center gap-8">
          {criticalItems.concat(criticalItems).map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => onSelectIndicator(item)}
              className="inline-flex items-center gap-2 text-rose-200 hover:text-white transition-colors group cursor-pointer"
            >
              <span className="font-semibold text-rose-400">[{item.aspect}]</span>
              <span className="font-medium text-slate-100 group-hover:underline">{item.measure}</span>
              <span className="font-number font-extrabold text-rose-400 bg-rose-900/80 px-1.5 py-0.5 rounded border border-rose-700/60">
                {item.rate_formatted}
              </span>
              <ChevronRight className="w-3 h-3 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
