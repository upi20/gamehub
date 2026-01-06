
import React, { useState, useEffect, useRef } from 'react';

interface SlidingPuzzleProps {
  onBack: () => void;
}

type Mode = 'numbers' | 'image' | 'image_numbers';

const SlidingPuzzle: React.FC<SlidingPuzzleProps> = ({ onBack }) => {
  const [gridSize, setGridSize] = useState<number>(3);
  const [mode, setMode] = useState<Mode>('numbers');
  const [image, setImage] = useState<string | null>(null);
  const [tiles, setTiles] = useState<number[]>([]); // number represents original index (0 to N-1)
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [steps, setSteps] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and Shuffle
  const setupGame = () => {
    const total = gridSize * gridSize;
    const initialTiles = Array.from({ length: total }, (_, i) => i);
    
    // Perform random valid moves to shuffle (guarantees solvability)
    let currentTiles = [...initialTiles];
    let emptyIdx = total - 1;
    
    // Shuffling factor based on grid size
    const shuffleSteps = gridSize * gridSize * 20;
    
    for (let i = 0; i < shuffleSteps; i++) {
      const neighbors = getValidNeighbors(emptyIdx, gridSize);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [currentTiles[emptyIdx], currentTiles[randomNeighbor]] = [currentTiles[randomNeighbor], currentTiles[emptyIdx]];
      emptyIdx = randomNeighbor;
    }

    setTiles(currentTiles);
    setSteps(0);
    setHasWon(false);
    setIsGameStarted(true);
  };

  const getValidNeighbors = (idx: number, size: number) => {
    const neighbors: number[] = [];
    const r = Math.floor(idx / size);
    const c = idx % size;

    if (r > 0) neighbors.push(idx - size);
    if (r < size - 1) neighbors.push(idx + size);
    if (c > 0) neighbors.push(idx - 1);
    if (c < size - 1) neighbors.push(idx + 1);
    return neighbors;
  };

  const handleTileClick = (idx: number) => {
    if (hasWon) return;
    
    const emptyIdx = tiles.indexOf(gridSize * gridSize - 1);
    const neighbors = getValidNeighbors(emptyIdx, gridSize);
    
    if (neighbors.includes(idx)) {
      const newTiles = [...tiles];
      [newTiles[emptyIdx], newTiles[idx]] = [newTiles[idx], newTiles[emptyIdx]];
      setTiles(newTiles);
      setSteps(s => s + 1);
      
      // Check win
      if (newTiles.every((val, i) => val === i)) {
        setHasWon(true);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  if (!isGameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900">
        <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        
        <h2 className="text-3xl font-black text-green-400 mb-8 uppercase tracking-widest">Puzzle Setup</h2>
        
        <div className="w-full max-w-sm space-y-8">
          {/* Step 1: Difficulty */}
          <div>
            <label className="block text-slate-500 text-xs font-bold uppercase mb-3">Difficulty (Grid Size)</label>
            <div className="grid grid-cols-2 gap-3">
              {[3, 6, 9, 12].map(size => (
                <button
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={`p-4 rounded-xl font-bold border-2 transition-all active:scale-95 ${gridSize === size ? 'bg-green-600 border-green-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Mode */}
          <div>
            <label className="block text-slate-500 text-xs font-bold uppercase mb-3">Game Mode</label>
            <div className="flex flex-col gap-3">
              {[
                { id: 'numbers', label: 'Numbers Only', icon: 'fa-list-ol' },
                { id: 'image', label: 'Image Puzzle', icon: 'fa-image' },
                { id: 'image_numbers', label: 'Image + Hint Numbers', icon: 'fa-info-circle' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as Mode)}
                  className={`p-4 rounded-xl font-bold flex items-center border-2 transition-all active:scale-95 ${mode === m.id ? 'bg-green-600 border-green-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  <i className={`fas ${m.icon} mr-3`}></i>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Image (conditional) */}
          {(mode === 'image' || mode === 'image_numbers') && (
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase mb-3">Background Image</label>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-4 rounded-xl font-bold flex items-center justify-center border-2 border-dashed transition-all active:scale-95 ${image ? 'border-green-400 bg-green-900/20 text-green-400' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'}`}
              >
                {image ? (
                  <><i className="fas fa-check-circle mr-2"></i> Image Loaded</>
                ) : (
                  <><i className="fas fa-upload mr-2"></i> Choose Photo</>
                )}
              </button>
            </div>
          )}

          <button
            onClick={setupGame}
            disabled={(mode !== 'numbers' && !image)}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 font-black py-5 rounded-2xl transition-all shadow-xl shadow-green-900/20 uppercase tracking-widest text-lg"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const emptyIdxValue = gridSize * gridSize - 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-950">
      <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-slate-950/80 backdrop-blur-md z-10 border-b border-slate-900">
        <button onClick={() => setIsGameStarted(false)} className="p-3 text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Steps</span>
            <span className="text-xl font-black text-green-400 leading-none">{steps}</span>
        </div>
        <button onClick={setupGame} className="p-3 text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-rotate"></i>
        </button>
      </header>

      <div 
        className="bg-slate-900 p-1 rounded-lg shadow-2xl overflow-hidden mt-20"
        style={{ 
          width: 'min(90vw, 450px)', 
          height: 'min(90vw, 450px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gap: gridSize > 9 ? '1px' : '2px'
        }}
      >
        {tiles.map((tileValue, idx) => {
          const isEmpty = tileValue === emptyIdxValue;
          const originalRow = Math.floor(tileValue / gridSize);
          const originalCol = tileValue % gridSize;
          
          if (isEmpty) return <div key={idx} className="bg-slate-950/50" />;

          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              className={`relative flex items-center justify-center transition-all duration-75 active:scale-95 group overflow-hidden
                ${mode === 'numbers' ? 'bg-slate-800 border border-slate-700' : ''}
              `}
              style={mode !== 'numbers' && image ? {
                backgroundImage: `url(${image})`,
                backgroundSize: `${gridSize * 100}%`,
                backgroundPosition: `${(originalCol / (gridSize - 1)) * 100}% ${(originalRow / (gridSize - 1)) * 100}%`,
              } : {}}
            >
              {/* Tile Overlay for Numbers */}
              {(mode === 'numbers' || mode === 'image_numbers') && (
                <div className={`
                  ${mode === 'numbers' 
                    ? 'text-white font-bold' 
                    : 'absolute top-0 right-0 bg-black/60 text-white p-0.5 min-w-[1.2rem] text-center rounded-bl-md'
                  }
                  ${gridSize > 9 ? 'text-[8px]' : gridSize > 6 ? 'text-xs' : 'text-lg'}
                `}>
                  {tileValue + 1}
                </div>
              )}
              
              {/* Tap Highlight */}
              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity"></div>
            </button>
          );
        })}
      </div>

      {hasWon && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-slate-800 p-8 rounded-3xl text-center shadow-2xl border-2 border-green-500 max-w-xs w-full">
            <div className="w-20 h-20 bg-green-500 mx-auto rounded-full flex items-center justify-center text-4xl text-slate-900 mb-6 animate-bounce">
              <i className="fas fa-check-double"></i>
            </div>
            <h2 className="text-4xl font-black mb-2 text-white">SOLVED!</h2>
            <p className="text-slate-400 mb-8">Completed in <span className="text-green-400 font-bold">{steps}</span> moves.</p>
            <div className="space-y-3">
              <button
                onClick={setupGame}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={() => setIsGameStarted(false)}
                className="w-full text-slate-500 hover:text-slate-300 font-bold py-2 transition-colors"
              >
                SETTINGS
              </button>
              <button
                onClick={onBack}
                className="w-full text-slate-600 hover:text-slate-400 text-sm font-medium transition-colors"
              >
                QUIT TO HUB
              </button>
            </div>
          </div>
        </div>
      )}
      
      <p className="mt-8 text-slate-500 text-sm font-medium animate-pulse">
        {hasWon ? 'Congratulations!' : 'Tap tiles near the gap to move them'}
      </p>
    </div>
  );
};

export default SlidingPuzzle;
