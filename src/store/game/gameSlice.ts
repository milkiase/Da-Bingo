import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type GameState = {
    calls: number[],
    pattern: string,
    players: number[],
    isWon: boolean,
    id: string,
    betAmount: number,
    winAmount: number,
    percentage: number
}
const INITIAL_GAME_STATE: GameState = {
    calls: [],
    pattern: 'Any Line',
    players: [],
    isWon: false,
    id: '',
    betAmount: 0,
    winAmount: 0,
    percentage: 0
}

const gameSlice = createSlice({
    name: 'game',
    initialState: INITIAL_GAME_STATE,
    reducers: {
        addCall(state, action: PayloadAction<number>) {
            state.calls.push(action.payload)
        },
        setCalls(state, action: PayloadAction<number[]>) {
            state.calls = action.payload
        },
        resetGame(state) {
            state.calls = [],
                state.pattern = 'Any Line',
                state.players = [],
                state.isWon = false,
                state.id = '',
                state.betAmount = 0,
                state.winAmount = 0,
                state.percentage = 0
        },
        setGamePatternType(state, action: PayloadAction<string>) {
            state.pattern = action.payload
        },
        setPlayers(state, action: PayloadAction<number[]>) {
            state.players = action.payload
        },
        setIsWon(state, action: PayloadAction<boolean>) {
            state.isWon = action.payload
        },
        setID(state, action: PayloadAction<string>) {
            state.id = action.payload
        },
        setGameBetAmount(state, action: PayloadAction<number>) {
            state.betAmount = action.payload
        },
        setGameWinAmount(state, action: PayloadAction<number>) {
            state.winAmount = action.payload
        },
        setGamePercentage(state, action: PayloadAction<number>) {
            state.percentage = action.payload
        },
        removePlayer(state, action: PayloadAction<number>) {
            state.players = state.players.filter(player => player !== action.payload)
        }
    }
})

export const { addCall, setCalls, resetGame, setGamePatternType, setPlayers, setIsWon, setID, setGameBetAmount, setGameWinAmount, setGamePercentage, removePlayer } = gameSlice.actions;
const gameReducer = gameSlice.reducer;
export default gameReducer;