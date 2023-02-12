import { configureStore } from '@reduxjs/toolkit'
import itemListSlice from '../features/counterSlice'
export const store = configureStore({
    reducer: {
        itemList: itemListSlice
    }
});