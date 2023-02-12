import { View, Text, Button } from "react-native";
import ExpensesOutput from "../Components/ExpensesOutput/ExpensesOutput";
import { Dummy_expenses } from "../Data/ExpensesData";
import { useSelector, useDispatch } from 'react-redux';
import { useContext } from "react";
import { ExpensesContext } from "../Data/expenses-context";
function AllExpensesScreen({ navigation, route }) {
    // const expenseData = useContext(ExpensesContext);
    const expenseData = useSelector((state) => state.itemList.expenses)

    return (
        <ExpensesOutput expenses={expenseData} periodName="Total" />
    )
}

export default AllExpensesScreen;