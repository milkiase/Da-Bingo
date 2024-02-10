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
    key: 'lucky-bingo',
    storage,
    whitelist: ['auth', 'setup', 'game']
}, rootReducer)

export type RootState = ReturnType<typeof rootReducer>
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export type RootActions = typeof store.dispatch

export const persistor = persistStore(store)