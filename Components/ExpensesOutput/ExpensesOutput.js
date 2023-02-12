import { View, Text, FlatList, StyleSheet } from "react-native";
import ExpensesList from "./ExpensesList";
import { Dummy_expenses } from "../../Data/ExpensesData";
import ExpensesSummary from "./ExpensesSummary";
import { GlobalStyles } from "../../Constants/styles";
// import Dummy_expenses from '../../Data/ExpensesData'
function ExpensesOutput({ expenses, periodName }) {
    return (
        <View style={styles.container}>
            <ExpensesSummary expenses={expenses} periodName={periodName}></ExpensesSummary>
            <ExpensesList expenses={expenses} />
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary700,
    }
})
export default ExpensesOutput;