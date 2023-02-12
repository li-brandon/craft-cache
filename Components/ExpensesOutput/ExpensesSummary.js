import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../Constants/styles";

function ExpensesSummary({ expenses, periodName }) {
    const ExpenseSum = expenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);
    return (
        <View style={styles.container}>
            <Text style={styles.period}>{periodName}</Text>
            <Text style={styles.sum}>Spent ${ExpenseSum.toFixed(2)} </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: GlobalStyles.colors.primary50,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    period: {
        fontSize: 12,
        // fontWeight:'bold',
        color: GlobalStyles.primary400,
    },
    sum: {
        fontSize: 16,
        fontWeight: 'bold',
        color: GlobalStyles.primary500,
    }
})

export default ExpensesSummary;