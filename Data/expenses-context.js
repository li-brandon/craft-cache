import { createContext, useReducer } from "react";
import { Dummy_expenses } from "./ExpensesData";
export const ExpensesContext = createContext({
    expenses: [],
    addExpense: ({ description, amout, date }) => { },
    deleteExpense: (id) => { },
    updateExpense: (id, { description, amout, date }) => { },
});
function expensesReducer(state, action) {
    switch (action.type) {
        case 'Add':
            const id = new Date().toString() + Math.random().toString();
            return [{ ...action.payload, id: id }, ...state]
        case 'Update':
            const updateItemIndex = state.findIndex((expenses) => { expenses.id = action.payload.id });
            const updateItem = state[updateItemIndex];
            const newUpdateItem = { ...updateItem, ...action.payload.expenseData };
            const newState = [...state];
            newState[updateItemIndex] = newUpdateItem;
            return newState;
        case 'Delete':
            // console.log(action.payload)
            return state.filter((expense) => expense.id !== action.payload);
        default:
            return state;
    }
}
function ExpensesContextProvider({ children }) {
    const [expensesState, dispatch] = useReducer(expensesReducer, Dummy_expenses);
    function addExpense(expenseData) {
        dispatch({ type: 'Add', payload: expenseData });
    }
    function deleteExpense(id) {
        dispatch({ type: 'Delete', payload: id });
    }
    function updateExpense(id, expenseData) {
        dispatch({ type: 'Update', payload: { id: id, expenseData: expenseData } });
    }
    const value = {
        expenses: expensesState,
        addExpense: addExpense,
        deleteExpense: deleteExpense,
        updateExpense: updateExpense,
    };
    return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
}

export default ExpensesContextProvider;
