import { RootState } from "../store";

export const selectToken = (state: RootState) => {
    return state.auth.token
}

export const selectUserInfo = (state: RootState) => {
    return { id: state.auth.id, isAdmin: state.auth.isAdmin, username: state.auth.username }
}

export const selectIsUserAdmin = (state: RootState) => {
    return state.auth.isAdmin
}

export const selectIsUserSuperAdmin = (state: RootState) => {
    return state.auth.isSuperAdmin
}
