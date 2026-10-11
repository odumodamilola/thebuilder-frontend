import React from 'react';

export function CircuitLine({ height = 24, nodes = false, animate = false, className = '' }) {
  return (
    <div className={`w-full flex items-center opacity-20 ${className}`} style={{ height }}>
      <div className="w-full h-px bg-slate-300 relative">
        {nodes && (
          <>
            <div className="absolute left-1/4 -top-[3px] w-2 h-2 rounded-full bg-slate-400" />
            <div className="absolute left-3/4 -top-[3px] w-2 h-2 rounded-full bg-slate-400" />
          </>
        )}
      </div>
    </div>
  );
}
