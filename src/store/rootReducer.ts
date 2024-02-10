import { combineReducers } from '@reduxjs/toolkit';
import { cardReducer } from './setup/setupSlice';
import authReducer from './auth/authSlice';
import gameReducer from './game/gameSlice';
import adminReducer from './admin/adminSlice';
import { roomReducer } from './room/roomSlice';

export const rootReducer = combineReducers({
    setup: cardReducer,
    auth: authReducer,
    game: gameReducer,
    admin: adminReducer,
    room: roomReducer
})