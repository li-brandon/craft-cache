import { createSlice } from '@reduxjs/toolkit'
import { Dummy_expenses } from '../Data/ExpensesData'
export const itemListSlice = createSlice({
    name: 'itemList',
    initialState: {
        expenses: Dummy_expenses,
    },
    reducers: {
        deleteItem: (state, action) => {
            // console.log(state.expenses);
            // state.expenses.filter((expense) => {
            //     // console.log(expense['id'] + "," + action.payload.id);
            //     console.log(expense['id'] !== action.payload.id);
            //     // return 
            //     expense['id'] !== action.payload.id
            // });


            const isLargeNumber = (element) => element.id === action.payload.id;
            // console.log(state.expenses.findIndex(isLargeNumber));
            state.expenses.splice(state.expenses.findIndex(isLargeNumber), 1);
            // console.log("data:" + state.expenses.length);
        },
        addItem: (state, action) => {
            console.log('add')
        },
        updateItem: (state, action) => {
            console.log('update')
        }
    }
})
export const { deleteItem, addItem, updateItem } = itemListSlice.actions
export default itemListSlice.reducer;