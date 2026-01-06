
import React, { useState } from 'react';

interface TugOfWarProps {
  onBack: () => void;
}

const TugOfWar: React.FC<TugOfWarProps> = ({ onBack }) => {
  // ropePos represents the center knot position. 
  // 50 is center. 0 is P2's side (top). 100 is P1's side (bottom).
  const [ropePos, setRopePos] = useState(50);
  const [winner, setWinner] = useState<'P1' | 'P2' | null>(null);

  const resetGame = () => {
    setRopePos(50);
    setWinner(null);
  };

  const handlePullP1 = () => {
    if (winner) return;
    setRopePos(p => {
      const next = p + 4;
      if (next >= 90) { // P1 pulls the knot to their "win line"
        setWinner('P1');
        return 100;
      }
      return next;
    });
  };

  const handlePullP2 = () => {
    if (winner) return;
    setRopePos(p => {
      const next = p - 4;
      if (next <= 10) { // P2 pulls the knot to their "win line"
        setWinner('P2');
        return 0;
      }
      return next;
    });
  };

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-slate-900">
      {/* P2 Side (Top, Purple) */}
      <div 
        style={{ height: `${ropePos}%` }}
        className="bg-purple-900/40 transition-all duration-150 flex items-start justify-center pt-16 relative"
        onMouseDown={handlePullP2}
        onTouchStart={(e) => { e.preventDefault(); handlePullP2(); }}
      >
        <div className="flex flex-col items-center rotate-180 select-none opacity-80">
          <i className="fas fa-user-ninja text-7xl text-purple-400 mb-2"></i>
          <span className="text-purple-300 font-black text-4xl uppercase opacity-40">PULL!</span>
        </div>
        {/* Win Line P2 */}
        <div className="absolute top-[10%] left-0 w-full h-1 bg-red-500/30 border-y border-red-500/50 flex items-center justify-center">
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">P2 Win Line</span>
        </div>
      </div>

      {/* The Rope & Knot */}
      <div 
        className="absolute w-full h-12 z-10 -translate-y-1/2 flex items-center justify-center transition-all duration-150"
        style={{ top: `${ropePos}%` }}
      >
        {/* Rope Texture */}
        <div className="absolute w-[200%] h-4 bg-amber-800 shadow-[0_4px_10px_rgba(0,0,0,0.5)] rotate-1 flex items-center">
            <div className="w-full h-1 bg-amber-600/30"></div>
        </div>
        {/* The Knot (Center Marker) */}
        <div className="relative w-10 h-16 bg-red-600 rounded-sm shadow-xl border-x-4 border-red-400 flex items-center justify-center">
            <div className="w-1 h-12 bg-white/20"></div>
            <i className="fas fa-anchor text-white text-xs absolute"></i>
        </div>
      </div>

      {/* P1 Side (Bottom, Indigo) */}
      <div 
        style={{ height: `${100 - ropePos}%` }}
        className="bg-indigo-900/40 transition-all duration-150 flex items-end justify-center pb-16 relative"
        onMouseDown={handlePullP1}
        onTouchStart={(e) => { e.preventDefault(); handlePullP1(); }}
      >
        {/* Win Line P1 */}
        <div className="absolute bottom-[10%] left-0 w-full h-1 bg-red-500/30 border-y border-red-500/50 flex items-center justify-center">
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">P1 Win Line</span>
        </div>
        <div className="flex flex-col items-center select-none opacity-80">
          <span className="text-indigo-300 font-black text-4xl uppercase opacity-40 mb-2">PULL!</span>
          <i className="fas fa-user-ninja text-7xl text-indigo-400"></i>
        </div>
      </div>

      {/* HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-20 pointer-events-none">
        <button 
          onClick={onBack}
          className="p-3 bg-black/40 rounded-full text-white backdrop-blur-sm active:scale-90 transition-transform pointer-events-auto"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <button 
          onClick={resetGame}
          className="p-3 bg-black/40 rounded-full text-white backdrop-blur-sm active:scale-90 transition-transform pointer-events-auto"
        >
          <i className="fas fa-rotate"></i>
        </button>
      </div>

      {/* Winner Overlay */}
      {winner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className={`bg-slate-800 p-8 rounded-3xl text-center shadow-2xl border-4 max-w-xs w-full transform scale-110 animate-in fade-in zoom-in duration-300 ${winner === 'P1' ? 'border-indigo-500 shadow-indigo-500/50' : 'border-purple-500 shadow-purple-500/50'}`}>
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl text-white ${winner === 'P1' ? 'bg-indigo-500' : 'bg-purple-500'}`}>
               <i className="fas fa-trophy"></i>
            </div>
            <h2 className="text-4xl font-black mb-2 text-white">
              {winner === 'P1' ? 'PLAYER 1 WINS!' : 'PLAYER 2 WINS!'}
            </h2>
            <p className="text-slate-400 mb-6 font-medium italic">Supreme Grip Strength!</p>
            <button
              onClick={resetGame}
              className={`w-full text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg mb-3 ${winner === 'P1' ? 'bg-indigo-600 hover:bg-indigo-50' : 'bg-purple-600 hover:bg-purple-500'}`}
            >
              PLAY AGAIN
            </button>
            <button
              onClick={onBack}
              className="w-full text-slate-500 hover:text-slate-300 font-bold transition-colors"
            >
              QUIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TugOfWar;
