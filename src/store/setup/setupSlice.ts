import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { patternTypes } from '../../utils/game.utils';

type SetupState = {
    cards: number[],
    percentage: number,
    betAmount: number,
    winAmount: number,
    profit: number,
    patternType: string,
    pattern: boolean[][],
    gameID: string,
}
export const INITIAL_STATE: SetupState = {
    cards: [],
    percentage: 20,
    betAmount: 20,
    winAmount: 0,
    profit: 0,
    patternType: 'Any Line',
    pattern: [],
    gameID: ''
}

const setupSlice = createSlice({
    name: 'cards',
    initialState: INITIAL_STATE,
    reducers: {
        buyCard(state, action: PayloadAction<number>) {
            state.cards.push(action.payload)
        },
        removeCard(state, action: PayloadAction<number>) {
            state.cards = state.cards.filter((value) => value != action.payload)
        },
        changePercentage(state, action: PayloadAction<number>) {
            state.percentage = action.payload
        },
        changeBetAmount(state, action: PayloadAction<number>) {
            state.betAmount = action.payload
        },
        changeWinAmount(state, action: PayloadAction<number>) {
            state.winAmount = action.payload
            state.profit = state.cards.length * state.betAmount - action.payload
        },
        changePatternType(state, action: PayloadAction<string>) {
            state.patternType = action.payload
        },
        setGameID(state, action: PayloadAction<string>) {
            state.gameID = action.payload
        },
        setSetupPattern(state, action: PayloadAction<boolean[][]>) {
            state.pattern = action.payload
        },
        resetSetupPage(state) {
            state.betAmount = 0
            state.cards = []
            // state.pattern = []
            state.percentage = 20
            state.betAmount = 20
            state.winAmount = 0
            state.profit = 0
            state.patternType = patternTypes.anyLine
        }
    }
})

export const { buyCard, removeCard, changeBetAmount, changePercentage, changeWinAmount,
    changePatternType, setSetupPattern, setGameID, resetSetupPage } = setupSlice.actions
export const cardReducer = setupSlice.reducer