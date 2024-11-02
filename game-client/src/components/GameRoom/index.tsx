import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { NumberPad } from '../NumberPad';
import { gameService } from '../../services/gameService';
import './GameRoom.scss';

export const GameRoom = (): JSX.Element => {
  const { state, dispatch } = useGameContext();
  const { currentRoom, selectedNumbers } = state;
  const [isReady, setIsReady] = useState(false);
  const [guessMode, setGuessMode] = useState(false);

  useEffect(() => {
    if (!currentRoom?.id) return;
    
    const { subscribe, close } = gameService.connectWebSocket(currentRoom.id);
    const unsubscribe = subscribe((data) => {
      if (data.room) {
        dispatch({ type: 'SET_ROOM', payload: data.room });
      }
      if (data.result) {
        // 顯示猜測結果
        console.log('猜測結果:', data.result);
      }
    });

    return () => {
      unsubscribe();
      close();
    };
  }, [currentRoom?.id, dispatch]);

  const handleNumberSelect = (number: string) => {
    dispatch({ type: 'SELECT_NUMBER', payload: number });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_NUMBERS' });
  };

  const handleRandom = () => {
    handleClear();
    const numbers = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * numbers.length);
      handleNumberSelect(numbers.splice(index, 1)[0]);
    }
  };

  const handleConfirm = async () => {
    if (!currentRoom?.id) return;
    try {
      if (guessMode) {
        await gameService.makeGuess(currentRoom.id, selectedNumbers.join(''));
      } else {
        await gameService.setNumber(currentRoom.id, selectedNumbers.join(''));
        setIsReady(true);
      }
      dispatch({ type: 'CLEAR_NUMBERS' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: guessMode ? '猜測失敗' : '設置數字失敗' });
    }
  };

  const handleReady = async () => {
    if (!currentRoom?.id) return;
    try {
      await gameService.setReady(currentRoom.id);
      setIsReady(true);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '準備失敗' });
    }
  };

  return (
    <div className="game-room">
      <h2>遊戲房間 {currentRoom?.id}</h2>
      <div className="room-info">
        <div className="player-status">
          <div>玩家1: {currentRoom?.player1?.ready ? '已準備' : '未準備'}</div>
          {currentRoom?.player2 && (
            <div>玩家2: {currentRoom.player2.ready ? '已準備' : '未準備'}</div>
          )}
        </div>
        {!isReady && (
          <button 
            className="btn btn-primary mb-4"
            onClick={handleReady}
          >
            準備開始
          </button>
        )}
      </div>
      <NumberPad
        selectedNumbers={selectedNumbers}
        onNumberSelect={handleNumberSelect}
        onClear={handleClear}
        onRandom={handleRandom}
        onConfirm={handleConfirm}
        disabled={isReady && !guessMode}
      />
      {currentRoom?.guessHistory && (
        <div className="guess-history">
          <h3>猜測記錄</h3>
          {currentRoom.guessHistory.map((history, index) => (
            <div key={index} className="guess-item">
              <span>玩家 {history.playerId}</span>
              <span>猜測: {history.guess}</span>
              <span>結果: {history.result}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
