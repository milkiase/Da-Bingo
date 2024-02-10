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
export const selectRoomID = (state: RootState) => state.setup.roomID
export const selectIsRoomLoading = (state: RootState) => state.setup.roomLoading
export const selectIsBuyingCard = (state: RootState) => state.setup.buyingCard
export const selectCardBeingBought = (state: RootState) => state.setup.cardBeingBought
export const selectCardObjList = (state: RootState) => state.setup.cardObjList
export const selectErrorBuyingCartela = (state: RootState) => state.setup.errorBuyingCartela
