
export enum GameType {
  TRAP_THE_CAT = 'TRAP_THE_CAT',
  XOXO = 'XOXO',
  NINJA_FIGHT = 'NINJA_FIGHT',
  TUG_OF_WAR = 'TUG_OF_WAR',
  SLIDING_PUZZLE = 'SLIDING_PUZZLE',
  SUDOKU = 'SUDOKU'
}

export interface GameMetadata {
  id: GameType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export type Player = 'P1' | 'P2' | null;
