import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type HouseType = {
    _id: string,
    name: string,
    city: string,
    detail: string,
    isActive: boolean
}
export type CashierType = {
    name: string,
    id: string,
    isAdmin: boolean,
    dateCreated: string
}

export type GameType = {
    players: number[],
    scores?: number[],
    isWon: boolean,
    id: string,
    pattern: string,
    amount: number,
    winamount: number,
    percentage: number,
    postedby: string,
    dateCreated: Date,

}
type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

type AdminStateType = {
    cashiers: CashierType[],
    dateRange: Value,
    games: GameType[],
    houses: HouseType[]
}

const initialAdminState: AdminStateType = {
    cashiers: [],
    dateRange: [new Date(), new Date()],
    games: [],
    houses: []
}
type SetHouseActiveStateProps = {
    id: string,
    isActive: boolean
}
const adminSlice = createSlice({
    name: 'admin',
    initialState: initialAdminState,
    reducers: {
        setCashiers(state, action: PayloadAction<CashierType[]>) {
            state.cashiers = action.payload
        },
        addCashier(state, action: PayloadAction<CashierType>) {
            state.cashiers.push(action.payload)
        },
        removeCashier(state, action: PayloadAction<string>) {
            state.cashiers = state.cashiers.filter(({ id }) => id != action.payload)
        },
        setDateRange(state, action: PayloadAction<Value>) {
            state.dateRange = action.payload
        },
        setGames(state, action: PayloadAction<GameType[]>) {
            state.games = action.payload
        },
        setHouses(state, action: PayloadAction<HouseType[]>) {
            state.houses = action.payload
        },
        addHouse(state, action: PayloadAction<HouseType>) {
            state.houses.push(action.payload)
        },
        removeHouse(state, action: PayloadAction<string>) {
            state.houses = state.houses.filter(({ _id }) => _id !== action.payload)
        },
        setHouseActiveState(state, action: PayloadAction<SetHouseActiveStateProps>) {
            state.houses = state.houses.map((house: HouseType) => {
                return (house._id === action.payload.id ? { ...house, isActive: action.payload.isActive } : house)
            })
        }
    }
})

export const { setCashiers, addCashier, removeCashier, setDateRange, setGames, setHouses, addHouse, removeHouse, setHouseActiveState } = adminSlice.actions
const adminReducer = adminSlice.reducer
export default adminReducer