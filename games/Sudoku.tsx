
import React, { useState, useEffect, useCallback } from 'react';

interface SudokuProps {
  onBack: () => void;
}

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

const Sudoku: React.FC<SudokuProps> = ({ onBack }) => {
  const [board, setBoard] = useState<number[]>(new Array(81).fill(0));
  const [fixed, setFixed] = useState<boolean[]>(new Array(81).fill(false));
  const [selected, setSelected] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [conflicts, setConflicts] = useState<number[]>([]);

  // Backtracking solver to generate a valid board
  const solve = (grid: number[]): boolean => {
    for (let i = 0; i < 81; i++) {
      if (grid[i] === 0) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (const num of nums) {
          if (isValid(grid, row, col, num)) {
            grid[i] = num;
            if (solve(grid)) return true;
            grid[i] = 0;
          }
        }
        return false;
      }
    }
    return true;
  };

  const isValid = (grid: number[], row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (grid[row * 9 + i] === num) return false;
      if (grid[i * 9 + col] === num) return false;
      const r = Math.floor(row / 3) * 3 + Math.floor(i / 3);
      const c = Math.floor(col / 3) * 3 + (i % 3);
      if (grid[r * 9 + c] === num) return false;
    }
    return true;
  };

  const generateGame = useCallback((diff: Difficulty) => {
    const newBoard = new Array(81).fill(0);
    solve(newBoard);
    
    const newFixed = new Array(81).fill(true);
    let attempts = diff === 'EASY' ? 35 : diff === 'MEDIUM' ? 45 : 55;
    
    while (attempts > 0) {
      const idx = Math.floor(Math.random() * 81);
      if (newBoard[idx] !== 0) {
        newBoard[idx] = 0;
        newFixed[idx] = false;
        attempts--;
      }
    }

    setBoard(newBoard);
    setFixed(newFixed);
    setDifficulty(diff);
    setIsWon(false);
    setSelected(null);
    setConflicts([]);
  }, []);

  const handleCellClick = (idx: number) => {
    if (fixed[idx]) {
      // Allow selecting fixed cells for highlighting, but keypad won't change them
      setSelected(idx);
    } else {
      setSelected(idx);
    }
  };

  const checkConflicts = (currentBoard: number[]) => {
    const newConflicts: number[] = [];
    for (let i = 0; i < 81; i++) {
      if (currentBoard[i] === 0) continue;
      const row = Math.floor(i / 9);
      const col = i % 9;
      const val = currentBoard[i];
      
      // Check row
      for (let c = 0; c < 9; c++) {
        if (c !== col && currentBoard[row * 9 + c] === val) newConflicts.push(i);
      }
      // Check col
      for (let r = 0; r < 9; r++) {
        if (r !== row && currentBoard[r * 9 + col] === val) newConflicts.push(i);
      }
      // Check box
      const startR = Math.floor(row / 3) * 3;
      const startC = Math.floor(col / 3) * 3;
      for (let r = startR; r < startR + 3; r++) {
        for (let c = startC; c < startC + 3; c++) {
          if ((r !== row || c !== col) && currentBoard[r * 9 + c] === val) newConflicts.push(i);
        }
      }
    }
    setConflicts([...new Set(newConflicts)]);
  };

  const handleInput = (num: number) => {
    if (selected === null || fixed[selected] || isWon) return;

    const newBoard = [...board];
    newBoard[selected] = newBoard[selected] === num ? 0 : num; // Toggle or clear
    setBoard(newBoard);
    checkConflicts(newBoard);

    // Check Win Condition
    if (newBoard.every(n => n !== 0) && conflicts.length === 0) {
      // Need a full validation on the final state to be sure
      let finalWin = true;
      for(let i=0; i<81; i++) {
          const r = Math.floor(i/9);
          const c = i%9;
          const v = newBoard[i];
          const temp = [...newBoard];
          temp[i] = 0;
          if(!isValid(temp, r, c, v)) {
              finalWin = false;
              break;
          }
      }
      if(finalWin) setIsWon(true);
    }
  };

  const getHighlightClass = (idx: number) => {
    if (selected === null) return '';
    const row = Math.floor(idx / 9);
    const col = idx % 9;
    const sRow = Math.floor(selected / 9);
    const sCol = selected % 9;
    const sBoxR = Math.floor(sRow / 3);
    const sBoxC = Math.floor(sCol / 3);
    const boxR = Math.floor(row / 3);
    const boxC = Math.floor(col / 3);

    if (idx === selected) return 'bg-yellow-500/40';
    if (row === sRow || col === sCol || (boxR === sBoxR && boxC === sBoxC)) {
      return 'bg-slate-700/50';
    }
    return '';
  };

  if (!difficulty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900">
        <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
          <i className="fas fa-table-cells"></i>
        </div>
        <h2 className="text-3xl font-black text-yellow-500 mb-8 uppercase tracking-widest">Select Difficulty</h2>
        <div className="w-full max-w-xs space-y-4">
          {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(diff => (
            <button
              key={diff}
              onClick={() => generateGame(diff)}
              className="w-full py-5 bg-slate-800 border-2 border-slate-700 rounded-2xl font-black text-xl hover:bg-slate-700 hover:border-yellow-500/50 transition-all active:scale-95 text-slate-300"
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-slate-950">
      <header className="w-full max-w-md flex justify-between items-center py-4 mb-2">
        <button onClick={() => setDifficulty(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="px-4 py-1 bg-yellow-500 text-slate-900 rounded-full font-black text-xs tracking-tighter">
          {difficulty} SUDOKU
        </div>
        <button onClick={() => generateGame(difficulty)} className="p-2 text-slate-400 hover:text-white transition-colors" title="Reset">
          <i className="fas fa-rotate"></i>
        </button>
      </header>

      {/* 9x9 Grid */}
      <div className="grid grid-cols-9 bg-slate-800 p-0.5 rounded shadow-2xl border-2 border-slate-800 w-full max-w-sm aspect-square">
        {board.map((val, idx) => {
          const isConflict = conflicts.includes(idx);
          const isFixed = fixed[idx];
          const highlightClass = getHighlightClass(idx);
          
          // Borders for subgrids
          const row = Math.floor(idx / 9);
          const col = idx % 9;
          const borderClasses = `
            ${col % 3 === 2 && col !== 8 ? 'border-r-2 border-slate-600' : 'border-r border-slate-700/30'}
            ${row % 3 === 2 && row !== 8 ? 'border-b-2 border-slate-600' : 'border-b border-slate-700/30'}
          `;

          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              className={`relative flex items-center justify-center aspect-square text-xl transition-all ${borderClasses} ${highlightClass}`}
            >
              <span className={`
                ${isFixed ? 'text-white font-black' : 'text-blue-400 font-medium'}
                ${isConflict ? 'text-red-500' : ''}
              `}>
                {val !== 0 ? val : ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-sm mt-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleInput(num)}
            className="aspect-square bg-slate-800 rounded-xl flex items-center justify-center text-2xl font-black text-slate-300 hover:bg-slate-700 active:scale-90 transition-all border border-slate-700"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleInput(0)}
          className="aspect-square bg-slate-900 rounded-xl flex items-center justify-center text-xl font-black text-slate-500 border border-slate-800"
        >
          <i className="fas fa-eraser"></i>
        </button>
      </div>

      {isWon && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-slate-800 p-8 rounded-3xl text-center shadow-2xl border-4 border-yellow-500 max-w-xs w-full animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-yellow-500 mx-auto rounded-full flex items-center justify-center text-4xl text-slate-900 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
              <i className="fas fa-brain"></i>
            </div>
            <h2 className="text-4xl font-black mb-2 text-white">GENIUS!</h2>
            <p className="text-slate-400 mb-8 italic">Puzzle solved perfectly.</p>
            <div className="space-y-3">
              <button
                onClick={() => setDifficulty(null)}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-xl transition-all shadow-lg uppercase tracking-widest"
              >
                New Puzzle
              </button>
              <button
                onClick={onBack}
                className="w-full text-slate-500 hover:text-slate-300 font-bold py-2 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-8 text-slate-500 text-xs font-medium uppercase tracking-widest opacity-50">
        Logic Training Mode
      </p>
    </div>
  );
};

export default Sudoku;
