import { RootState } from "../store";

export const selectGameState = (state: RootState) => state.game
export const selectCalls = (state: RootState) => state.game.calls
export const selectGamePattern = (state: RootState) => state.game.pattern
export const selectCurrentGameID = (state: RootState) => state.game.id
export const selectPlayers = (state: RootState) => state.game.players
export const selectGameWinAmount = (state: RootState) => state.game.winAmount