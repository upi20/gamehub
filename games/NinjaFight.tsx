
import React, { useState } from 'react';

interface NinjaFightProps {
  onBack: () => void;
}

const NinjaFight: React.FC<NinjaFightProps> = ({ onBack }) => {
  // p1Height represents the percentage of the screen owned by Player 1 (Bottom, Blue).
  // 50 means equal split. 100 means P1 wins. 0 means P2 wins.
  const [p1Height, setP1Height] = useState(50);
  const [winner, setWinner] = useState<'P1' | 'P2' | null>(null);

  const resetGame = () => {
    setP1Height(50);
    setWinner(null);
  };

  const handleTapP1 = () => {
    if (winner) return;
    setP1Height(h => {
      const newHeight = h + 4;
      if (newHeight >= 100) {
        setWinner('P1');
        return 100;
      }
      return newHeight;
    });
  };

  const handleTapP2 = () => {
    if (winner) return;
    setP1Height(h => {
      const newHeight = h - 4;
      if (newHeight <= 0) {
        setWinner('P2');
        return 0;
      }
      return newHeight;
    });
  };

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-slate-900">
      {/* Player 2 Area (Top, Red) */}
      <div 
        style={{ height: `${100 - p1Height}%` }}
        className="bg-red-600 transition-all duration-150 relative flex items-center justify-center overflow-hidden"
        onMouseDown={handleTapP2}
        onTouchStart={(e) => { e.preventDefault(); handleTapP2(); }}
      >
        <div className="flex flex-col items-center rotate-180 select-none">
          <span className="text-red-200 font-black text-4xl uppercase opacity-30 mb-4">TAP TO PUSH</span>
          <i className="fas fa-user-ninja text-7xl text-white drop-shadow-lg animate-bounce"></i>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-400 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="h-1 w-full bg-white/30 z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>

      {/* Player 1 Area (Bottom, Blue) */}
      <div 
        style={{ height: `${p1Height}%` }}
        className="bg-blue-600 transition-all duration-150 relative flex items-center justify-center overflow-hidden"
        onMouseDown={handleTapP1}
        onTouchStart={(e) => { e.preventDefault(); handleTapP1(); }}
      >
        <div className="flex flex-col items-center select-none">
          <i className="fas fa-user-ninja text-7xl text-white drop-shadow-lg animate-bounce"></i>
          <span className="text-blue-200 font-black text-4xl uppercase opacity-30 mt-4">TAP TO PUSH</span>
        </div>

        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full blur-3xl"></div>
           <div className="absolute top-10 right-10 w-20 h-20 bg-blue-400 rounded-full blur-3xl"></div>
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
          <div className={`bg-slate-800 p-8 rounded-3xl text-center shadow-2xl border-4 max-w-xs w-full transform scale-110 animate-in fade-in zoom-in duration-300 ${winner === 'P1' ? 'border-blue-500 shadow-blue-500/50' : 'border-red-500 shadow-red-500/50'}`}>
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl text-white ${winner === 'P1' ? 'bg-blue-500' : 'bg-red-500'}`}>
               <i className="fas fa-crown"></i>
            </div>
            <h2 className="text-4xl font-black mb-2 text-white">
              {winner === 'P1' ? 'BLUE WINS!' : 'RED WINS!'}
            </h2>
            <p className="text-slate-400 mb-6 font-medium italic">Unstoppable Force!</p>
            <button
              onClick={resetGame}
              className={`w-full text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg mb-3 ${winner === 'P1' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'}`}
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

export default NinjaFight;
