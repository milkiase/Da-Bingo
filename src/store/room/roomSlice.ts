import { createSlice } from "@reduxjs/toolkit";

export type RoomState = {
    roomID: string,
    gameID: string,
    postedBy: {
        name?: string,
        dateCreated?: string,
        id?: string,
        room?: string
    },
    isDone: boolean
}

const initialState: RoomState = {
    roomID: "",
    gameID: "",
    postedBy: {},
    isDone: false
}

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoom(state, action) {
            state.roomID = action.payload?._id || ''
            state.gameID = action.payload?.game._id || ''
            state.postedBy = action.payload.postedby || {}
            state.isDone = action.payload.isdone || false
        },
        resetRoom(state) {
            state.roomID = initialState.roomID
            state.gameID = initialState.gameID
            state.postedBy = initialState.postedBy
            state.isDone = initialState.isDone
        }
    }
})

export const { setRoom, resetRoom } = roomSlice.actions

export const roomReducer = roomSlice.reducer