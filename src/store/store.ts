import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'

// const persistConfig = {
//     key: 'auth',
//     storage,
//     blacklist: ['game', 'cards']
// }

const persistedReducer = persistReducer({
    key: 'bingo',
    storage,
    whitelist: ['auth', 'setup']
}, rootReducer)

export type RootState = ReturnType<typeof rootReducer>
export const store = configureStore({
    reducer: persistedReducer,
    middleware: []
})

export const persistor = persistStore(store)