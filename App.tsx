
import React, { useState, useEffect } from 'react';
import { GameType, GameMetadata } from './types';
import TrapTheCat from './games/TrapTheCat';
import XOXO from './games/XOXO';
import NinjaFight from './games/NinjaFight';
import TugOfWar from './games/TugOfWar';
import SlidingPuzzle from './games/SlidingPuzzle';
import Sudoku from './games/Sudoku';

const GAMES: GameMetadata[] = [
  {
    id: GameType.TRAP_THE_CAT,
    title: 'Trap The Cat',
    description: 'Block the cat before it escapes the grid!',
    icon: 'fa-cat',
    color: 'bg-orange-500'
  },
  {
    id: GameType.XOXO,
    title: 'XOXO',
    description: 'Classic Tic-Tac-Toe for two players.',
    icon: 'fa-times',
    color: 'bg-blue-500'
  },
  {
    id: GameType.NINJA_FIGHT,
    title: 'Ninja Fight',
    description: 'Tap fast to push your opponent back!',
    icon: 'fa-user-ninja',
    color: 'bg-red-500'
  },
  {
    id: GameType.TUG_OF_WAR,
    title: 'Tug Of War',
    description: 'Pull the rope to your side in a tapping battle.',
    icon: 'fa-hands',
    color: 'bg-purple-500'
  },
  {
    id: GameType.SLIDING_PUZZLE,
    title: 'Sliding Puzzle',
    description: 'Solve the tile puzzle with numbers or photos!',
    icon: 'fa-puzzle-piece',
    color: 'bg-green-500'
  },
  {
    id: GameType.SUDOKU,
    title: 'Sudoku',
    description: 'Test your logic with classic 9x9 Sudoku puzzles.',
    icon: 'fa-table-cells',
    color: 'bg-yellow-500'
  }
];

const App: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const renderGame = () => {
    switch (activeGame) {
      case GameType.TRAP_THE_CAT:
        return <TrapTheCat onBack={() => setActiveGame(null)} />;
      case GameType.XOXO:
        return <XOXO onBack={() => setActiveGame(null)} />;
      case GameType.NINJA_FIGHT:
        return <NinjaFight onBack={() => setActiveGame(null)} />;
      case GameType.TUG_OF_WAR:
        return <TugOfWar onBack={() => setActiveGame(null)} />;
      case GameType.SLIDING_PUZZLE:
        return <SlidingPuzzle onBack={() => setActiveGame(null)} />;
      case GameType.SUDOKU:
        return <Sudoku onBack={() => setActiveGame(null)} />;
      default:
        return null;
    }
  };

  if (activeGame) {
    return <div className="min-h-screen w-full">{renderGame()}</div>;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen p-6 pb-20">
      <header className="mb-8 text-center mt-6">
        <div className="flex justify-center items-center gap-2 mb-2">
           <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            GAMEHUB
          </h1>
          {!isOnline && (
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-md border border-red-500/30">
              OFFLINE
            </span>
          )}
        </div>
        <p className="text-slate-400">Addictive mini-games collection</p>
      </header>

      {deferredPrompt && (
        <div className="mb-6 p-4 bg-indigo-600 rounded-2xl flex items-center justify-between shadow-lg animate-bounce-slow">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-mobile-screen-button text-white"></i>
             </div>
             <span className="text-sm font-bold">Install App to Home Screen?</span>
          </div>
          <button 
            onClick={handleInstallClick}
            className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-black text-xs uppercase"
          >
            Install
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className="flex items-center p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all active:scale-95 text-left group"
          >
            <div className={`w-16 h-16 ${game.color} rounded-xl flex items-center justify-center text-3xl shadow-lg mr-4 group-hover:rotate-12 transition-transform`}>
              <i className={`fas ${game.icon}`}></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{game.title}</h3>
              <p className="text-sm text-slate-400 leading-tight">{game.description}</p>
            </div>
            <i className="fas fa-chevron-right text-slate-600 ml-2"></i>
          </button>
        ))}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 text-center">
        <div className="flex justify-center items-center gap-2 text-xs text-slate-500">
           <i className={`fas fa-circle ${isOnline ? 'text-green-500' : 'text-red-500'} text-[6px]`}></i>
           <span>{isOnline ? 'Cloud Sync Ready' : 'Running in Offline Mode'}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
