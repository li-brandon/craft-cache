import { FlatList, View, Text } from "react-native";
import SingleExpenseItem from "./SingleExpenseItem";
function renderItem(itemData) {
    return (
        <SingleExpenseItem itemData={itemData} />
    )
}
function ExpensesList({ expenses }) {
    return (
        <FlatList
            data={expenses}
            renderItem={renderItem}
            keyExtractor={item => item.id}

        />
    )
}

export default ExpensesList;