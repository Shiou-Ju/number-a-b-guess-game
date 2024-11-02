import React, { createContext, useContext } from 'react';
import { GameState, GameAction } from '../types/game';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ 
  children, 
  value 
}: { 
  children: React.ReactNode; 
  value: GameContextType; 
}): React.ReactElement => {
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext 必須在 GameProvider 內使用');
  }
  return context;
};
