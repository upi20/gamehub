
import React, { useState, useEffect, useCallback } from 'react';

interface TrapTheCatProps {
  onBack: () => void;
}

const GRID_SIZE = 11;

const TrapTheCat: React.FC<TrapTheCatProps> = ({ onBack }) => {
  const [grid, setGrid] = useState<boolean[]>(new Array(GRID_SIZE * GRID_SIZE).fill(false));
  const [catPos, setCatPos] = useState<number>(Math.floor((GRID_SIZE * GRID_SIZE) / 2));
  const [gameOver, setGameOver] = useState<'WON' | 'LOST' | null>(null);
  const [steps, setSteps] = useState(0);

  const initGame = useCallback(() => {
    const center = Math.floor((GRID_SIZE * GRID_SIZE) / 2);
    const initialGrid = new Array(GRID_SIZE * GRID_SIZE).fill(false);
    for (let i = 0; i < 15; i++) {
      const rand = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
      if (rand !== center) initialGrid[rand] = true;
    }
    setGrid(initialGrid);
    setCatPos(center);
    setGameOver(null);
    setSteps(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const getNeighbors = (index: number) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const neighbors: number[] = [];

    const isEven = row % 2 === 0;
    const diffs = isEven 
      ? [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
      : [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];

    diffs.forEach(([dr, dc]) => {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        neighbors.push(nr * GRID_SIZE + nc);
      }
    });
    return neighbors;
  };

  const handleCellClick = (index: number) => {
    if (gameOver || grid[index] || index === catPos) return;

    const newGrid = [...grid];
    newGrid[index] = true;
    setGrid(newGrid);
    setSteps(s => s + 1);

    moveCat(newGrid, catPos);
  };

  const moveCat = (currentGrid: boolean[], currentCatPos: number) => {
    const neighbors = getNeighbors(currentCatPos);
    const available = neighbors.filter(n => !currentGrid[n]);

    if (available.length === 0) {
      setGameOver('WON');
      return;
    }

    const queue: [number, number[]][] = [[currentCatPos, []]];
    const visited = new Set<number>([currentCatPos]);
    let targetMove = available[Math.floor(Math.random() * available.length)];

    let foundPath = false;
    while (queue.length > 0) {
      const [curr, path] = queue.shift()!;
      
      const r = Math.floor(curr / GRID_SIZE);
      const c = curr % GRID_SIZE;
      if (r === 0 || r === GRID_SIZE - 1 || c === 0 || c === GRID_SIZE - 1) {
        if (path.length > 0) {
          targetMove = path[0];
          foundPath = true;
          break;
        }
      }

      for (const neighbor of getNeighbors(curr)) {
        if (!currentGrid[neighbor] && !visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }

    setCatPos(targetMove);

    const r = Math.floor(targetMove / GRID_SIZE);
    const c = targetMove % GRID_SIZE;
    if (r === 0 || r === GRID_SIZE - 1 || c === 0 || c === GRID_SIZE - 1) {
      setGameOver('LOST');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <div className="flex justify-between w-full max-w-2xl mb-4 items-center px-2">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="text-xl font-bold text-orange-400">Steps: {steps}</div>
        <button onClick={initGame} className="p-2 text-slate-400 hover:text-white transition-colors" title="Reset Game">
          <i className="fas fa-rotate"></i>
        </button>
      </div>

      <div className="relative p-4 bg-slate-800 rounded-2xl shadow-2xl mb-6 w-full max-w-xl">
        <div className="hex-grid w-full">
          {grid.map((isWall, idx) => {
            const isCat = idx === catPos;
            const row = Math.floor(idx / GRID_SIZE);
            const isEven = row % 2 === 0;

            return (
              <div
                key={idx}
                onClick={() => handleCellClick(idx)}
                className={`hex cursor-pointer flex items-center justify-center transition-all active:scale-90
                  ${isEven ? 'translate-x-[50%]' : ''}
                  ${isCat ? 'bg-orange-500 z-10 scale-110' : isWall ? 'bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'}
                `}
              >
                {isCat && <i className="fas fa-cat text-white text-lg"></i>}
              </div>
            );
          })}
        </div>
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 p-8 rounded-3xl text-center shadow-2xl border-2 border-orange-500 max-w-xs w-full">
            <h2 className="text-4xl font-black mb-4">
              {gameOver === 'WON' ? 'YOU WON!' : 'CAT ESCAPED!'}
            </h2>
            <p className="text-slate-400 mb-6">Total Steps: {steps}</p>
            <button
              onClick={initGame}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="w-full mt-3 text-slate-400 font-medium"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
      
      <p className="text-slate-500 text-sm italic text-center max-w-xs mt-4">
        Tap the light circles to turn them dark and block the cat's path.
      </p>
    </div>
  );
};

export default TrapTheCat;
