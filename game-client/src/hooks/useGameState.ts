import { useReducer } from 'react';
import { GameState, GameAction } from '../types/game';

const initialState: GameState = {
  currentRoomId: null,
  currentRoom: null,
  selectedNumbers: [],
  error: null
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_ROOM':
      return {
        ...state,
        currentRoom: action.payload,
      };
    case 'SET_ROOM_ID':
      return {
        ...state,
        currentRoomId: action.payload
      };
    case 'SELECT_NUMBER':
      if (state.selectedNumbers.length >= 4 || 
          state.selectedNumbers.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        selectedNumbers: [...state.selectedNumbers, action.payload]
      };
    case 'CLEAR_NUMBERS':
      return {
        ...state,
        selectedNumbers: []
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}

export const useGameState = () => {
  return useReducer(gameReducer, initialState);
};
