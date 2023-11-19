import { RootState } from "../store";

export const selectCashiers = (state: RootState) => state.admin.cashiers
export const selectDateRange = (state: RootState) => state.admin.dateRange
export const selectGames = (state: RootState) => state.admin.games
export const selectHouses = (state: RootState) => state.admin.houses