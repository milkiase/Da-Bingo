import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type UserInfo = {
    username: string,
    id: string,
    isAdmin: boolean,
    isSuperAdmin: boolean,
}
type AuthState = {
    token: string,
} & UserInfo
const INITIAL_STATE: AuthState = {
    token: '',
    username: '',
    id: '',
    isAdmin: false,
    isSuperAdmin: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload
        },
        setUserInfo(state, action: PayloadAction<UserInfo>) {
            //console.log(action.payload)
            state.username = action.payload.username
            state.id = action.payload.id
            state.isAdmin = action.payload.isAdmin
            state.isSuperAdmin = action.payload.isSuperAdmin
        },
        logOut(state) {
            state.id = ''
            state.token = ''
            state.isAdmin = false
            state.username = ''
            localStorage.removeItem('access-token')
        }
    }
})

export const { setToken, setUserInfo, logOut } = authSlice.actions
const authReducer = authSlice.reducer;
export default authReducer;