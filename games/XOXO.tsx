
import React, { useState } from 'react';
import { Player } from '../types';

interface XOXOProps {
  onBack: () => void;
}

const XOXO: React.FC<XOXOProps> = ({ onBack }) => {
  const [board, setBoard] = useState<(Player)[]>(new Array(9).fill(null));
  const [isP1Turn, setIsP1Turn] = useState(true);
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);

  const resetGame = () => {
    setBoard(new Array(9).fill(null));
    setIsP1Turn(true);
    setWinner(null);
  };

  const checkWinner = (squares: (Player)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(s => s !== null)) return 'DRAW' as const;
    return null;
  };

  const handleSquareClick = (idx: number) => {
    if (board[idx] || winner) return;

    const newBoard = [...board];
    newBoard[idx] = isP1Turn ? 'P1' : 'P2';
    setBoard(newBoard);
    
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
    } else {
      setIsP1Turn(!isP1Turn);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex justify-between w-full max-w-sm mb-8 items-center px-2">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className={`px-4 py-2 rounded-full font-bold ${isP1Turn ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
          {isP1Turn ? 'P1 (X) TURN' : 'P2 (O) TURN'}
        </div>
        <button onClick={resetGame} className="p-2 text-slate-400 hover:text-white transition-colors" title="Reset">
          <i className="fas fa-rotate"></i>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 bg-slate-800 p-4 rounded-3xl shadow-2xl">
        {board.map((val, idx) => (
          <button
            key={idx}
            onClick={() => handleSquareClick(idx)}
            className={`w-24 h-24 flex items-center justify-center rounded-2xl text-4xl font-black transition-all active:scale-90
              ${!val ? 'bg-slate-700 hover:bg-slate-600' : val === 'P1' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}
            `}
          >
            {val === 'P1' ? 'X' : val === 'P2' ? 'O' : ''}
          </button>
        ))}
      </div>

      {winner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className={`bg-slate-800 p-8 rounded-3xl text-center shadow-2xl border-2 max-w-xs w-full ${winner === 'P1' ? 'border-blue-500' : winner === 'P2' ? 'border-red-500' : 'border-slate-500'}`}>
            <h2 className="text-4xl font-black mb-4">
              {winner === 'DRAW' ? "IT'S A DRAW!" : `${winner === 'P1' ? 'PLAYER 1' : 'PLAYER 2'} WINS!`}
            </h2>
            <button
              onClick={resetGame}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors mb-3"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="w-full text-slate-400 font-medium"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default XOXO;
