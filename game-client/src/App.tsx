import React from 'react';
import { GameProvider } from './contexts/GameContext';
import { GameLobby } from './components/GameLobby';
import { GameRoom } from './components/GameRoom';
import { useGameState } from './hooks/useGameState';
import './App.scss';

const App = (): React.ReactElement => {
  const [gameState, dispatch] = useGameState();

  return (
    <GameProvider value={{ state: gameState, dispatch }}>
      <div className="container py-4">
        {!gameState.currentRoomId ? <GameLobby /> : <GameRoom />}
      </div>
    </GameProvider>
  );
};

export default App;
