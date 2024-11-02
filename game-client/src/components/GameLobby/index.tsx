import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { RoomListRoom } from '../../types/game';
import { gameService } from '../../services/gameService';
import './GameLobby.scss';

export const GameLobby = (): JSX.Element => {
  const { dispatch } = useGameContext();
  const [rooms, setRooms] = useState<RoomListRoom[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomList = await gameService.listRooms();
        setRooms(roomList);
      } catch (error) {
        console.error('獲取房間列表失敗:', error);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async () => {
    try {
      const room = await gameService.createRoom();
      dispatch({ type: 'SET_ROOM', payload: room });
      dispatch({ type: 'SET_ROOM_ID', payload: room.id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '創建房間失敗' });
    }
  };

  return (
    <div className="game-lobby">
      <h1>遊戲大廳</h1>
      <button 
        className="btn btn-primary mb-4"
        onClick={handleCreateRoom}
      >
        建立新房間
      </button>

      <div className="room-list">
        <h2>現有房間</h2>
        {rooms.map(room => (
          <div key={room.id} className="room-item">
            <span>房間 {room.id}</span>
            <span>狀態: {room.status}</span>
            <span>玩家數: {room.playerCount}/2</span>
          </div>
        ))}
      </div>
    </div>
  );
};
