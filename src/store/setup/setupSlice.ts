import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { patternTypes } from '../../utils/game.utils';
// import { customAlphabet } from 'nanoid';

type SetupState = {
    cards: number[],
    printedCards: number[],
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
    printedCards: [],
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
            state.printedCards = state.printedCards.filter((value) => value != action.payload)
        },
        printCard(state, action: PayloadAction<number>) {
            state.printedCards.push(action.payload)
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
            // console.log('new game ID, ', action.payload)
            state.gameID = action.payload
        },
        setSetupPattern(state, action: PayloadAction<boolean[][]>) {
            state.pattern = action.payload
        },
        resetSetupPage(state) {
            state.betAmount = 0
            state.cards = []
            state.printedCards = []
            state.percentage = 20
            state.betAmount = 20
            state.winAmount = 0
            state.profit = 0
            state.patternType = patternTypes.anyLine
            // state.gameID = customAlphabet('0123456789', 6)()
        }
    }
})

export const { buyCard, removeCard, printCard, changeBetAmount, changePercentage, changeWinAmount,
    changePatternType, setSetupPattern, setGameID, resetSetupPage } = setupSlice.actions
export const cardReducer = setupSlice.reducer