import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { patternTypes } from '../../utils/game.utils';
import { buyCartela, getGame } from '../../utils/backend.utils';
import { isAxiosError } from 'axios';

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
    roomID: string,
    roomLoading: boolean,
    buyingCard: boolean,
    cardBeingBought: number,
    cardObjList: { numberselected: number, userid: string }[]
    errorBuyingCartela: {
        code: number,
        isActive: boolean
    }
}

export const INITIAL_STATE: SetupState = {
    cards: [],
    printedCards: [],
    percentage: 0,
    betAmount: 0,
    winAmount: 0,
    profit: 0,
    patternType: 'Any Line',
    pattern: [],
    gameID: '',
    roomID: '',
    roomLoading: true,
    buyingCard: false,
    cardBeingBought: 0,
    cardObjList: [],
    errorBuyingCartela: {
        code: 0,
        isActive: false
    }
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
        setRoomID(state, action: PayloadAction<string>) {
            state.roomID = action.payload
        },
        resetSetupPage(state) {
            state.betAmount = 0
            state.cards = []
            state.printedCards = []
            state.percentage = 0
            state.betAmount = 0
            state.winAmount = 0
            state.profit = 0
            state.patternType = patternTypes.anyLine
            state.roomID = ''
            // state.gameID = customAlphabet('0123456789', 6)()
        },
        resetErrorBuyingCartela(state) {
            state.errorBuyingCartela = {
                code: 0,
                isActive: false
            }
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchRoomAsync.fulfilled, (state, action: PayloadAction<{ numberselected: number, userid: string }[]>) => {
            state.cards = action.payload.map(card => card.numberselected)
            state.cardObjList = action.payload
            state.roomLoading = false
        })
        builder.addCase(fetchRoomAsync.pending, (state) => {
            state.roomLoading = true
        })
        builder.addCase(fetchRoomAsync.rejected, (state) => {
            state.roomLoading = false
        })
        builder.addCase(buyCardAsync.fulfilled, (state, action: PayloadAction<{ numberselected: number, userid: string }[]>) => {
            state.cards = action.payload.map(card => card.numberselected)
            state.cardObjList = action.payload
            state.buyingCard = false
            state.cardBeingBought = 0
            state.errorBuyingCartela = {
                code: 0,
                isActive: false
            }
        })
            .addCase(buyCardAsync.pending, (state, params) => {
                state.buyingCard = true
                state.cardBeingBought = params.meta.arg.cardNumber
            })
            .addCase(buyCardAsync.rejected, (state, action) => {
                state.buyingCard = false
                state.cardBeingBought = 0
                // console.log(' buy cartela rejected with code: ', action.error.message)
                state.errorBuyingCartela = {
                    code: Number(action.error.message),
                    isActive: true
                }

            })
    },
})

export const buyCardAsync = createAsyncThunk(
    'setup/buyCardAsync',
    async ({ roomId, cardNumber }: { roomId: string, cardNumber: number }) => {
        try {
            const res = await buyCartela(roomId, cardNumber)
            // console.log('buyCartelaAsync:', res.data)
            return res.data.game.players
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.status.toString())
                }
            } else {
                throw new Error((error as Error).message)
            }
        }
    }
)

export const fetchRoomAsync = createAsyncThunk(
    'setup/fetchRoomAsync',
    async (gameID: string) => {
        const res = await getGame(gameID)
        // console.log('fetchRoomAsycn response:', res)
        return res.data.players
    }
)
export const { buyCard, removeCard, printCard, changeBetAmount, changePercentage, changeWinAmount,
    changePatternType, setSetupPattern, setGameID, resetSetupPage, setRoomID, resetErrorBuyingCartela } = setupSlice.actions
export const cardReducer = setupSlice.reducer