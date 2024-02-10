import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllUsers } from "../../utils/backend.utils";

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
    selectedRange: string,
    games: GameType[],
    houses: HouseType[],
    allUsers: CashierType[]
}
const fromDate = new Date()
fromDate.setUTCHours(0, 0, 0, 0);
const toDate = new Date()
toDate.setUTCHours(23, 59, 59, 999);

const initialAdminState: AdminStateType = {
    cashiers: [],
    dateRange: [fromDate, toDate],
    selectedRange: 'Today',
    games: [],
    houses: [],
    allUsers: []
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
        setSelectedRange(state, action: PayloadAction<string>) {
            state.selectedRange = action.payload
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
        },
        resetAdminState(state) {
            state.cashiers = []
            state.dateRange = [fromDate, toDate]
            state.selectedRange = 'Today'
            state.games = []
            state.houses = []
        },
        setAllUsers(state, action: PayloadAction<CashierType[]>) {
            state.allUsers = action.payload
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchAllUsersAsync.fulfilled, (state, action) => {
            state.allUsers = action.payload
        })
    }
})

export const fetchAllUsersAsync = createAsyncThunk('admin/fetchAllUsersAsync',
    async () => {
        const res = await fetchAllUsers()
        // console.log('fetch all users', res.data)
        return res.data.map((user: CashierType) => ({
            name: user.name,
            id: user.id,
            isAdmin: user.isAdmin,
            dateCreated: user.dateCreated
        }))
    }
)

export const { setCashiers, addCashier, removeCashier, setDateRange, setSelectedRange, setGames, setHouses, addHouse, removeHouse, setHouseActiveState, resetAdminState, setAllUsers } = adminSlice.actions
const adminReducer = adminSlice.reducer
export default adminReducer