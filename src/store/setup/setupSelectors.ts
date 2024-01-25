import { RootState } from "../store";

export const selectCards = (state: RootState) => state.setup.cards
export const selectPrintedCards = (state: RootState) => state.setup.printedCards
export const selectPercentage = (state: RootState) => state.setup.percentage
export const selectBetAmount = (state: RootState) => state.setup.betAmount
export const selectWinAmount = (state: RootState) => state.setup.winAmount
export const selectPattern = (state: RootState) => state.setup.pattern
export const selectPatternType = (state: RootState) => state.setup.patternType
export const selectGameID = (state: RootState) => state.setup.gameID
export const selectProfit = (state: RootState) => state.setup.profit