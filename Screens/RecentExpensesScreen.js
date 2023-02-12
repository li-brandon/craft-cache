import { useContext } from "react";
import { View, Text } from "react-native"
import { useSelector } from "react-redux";
import ExpensesOutput from "../Components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../Data/expenses-context";
import { Dummy_expenses } from "../Data/ExpensesData";
import { getDateMinusDays } from "../util/Date";
function RecentExpensesScreen() {
    const expenseData = useSelector((state) => state.itemList.expenses)
    console.log(expenseData)
    const recentExpenses = expenseData.filter((expense) => {
        const today = new Date();
        const last7date = getDateMinusDays(today, 7);
        return expense.date < last7date;
    });
    // console.log(expenseData.expenses)
    return (
        <ExpensesOutput expenses={recentExpenses} periodName="Last 7 days" />
    )
}

export default RecentExpensesScreen;