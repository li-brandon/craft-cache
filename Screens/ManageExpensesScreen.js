import { useContext, useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native"
import IconButton from "../Components/UI/IconButton";
import { GlobalStyles } from "../Constants/styles";
import { useSelector, useDispatch } from 'react-redux'
import CustiomButton from "../Components/UI/CustiomButton";
import { addItem, deleteItem, updateItem } from "../features/counterSlice";
import { ExpensesContext } from "../Data/expenses-context";
function ManageExpensesScreen({ navigation, route }) {
    const id = route.params?.id;
    const description = route.params?.content;
    const isEditting = !!id;// change int to boolean
    const expenses = useSelector((state) => state.itemList.expenses)
    const dispatch = useDispatch();
    // const Expenses = useContext(ExpensesContext);
    useLayoutEffect(() => {
        navigation.setOptions(
            {
                title: isEditting ? 'Edit Expense' : 'add Expense'
            }
        );
    }, [navigation, isEditting]);
    function CloseScreen() {
        navigation.goBack();
    }
    function DeleteHandler(id) {
        // Expenses.deleteExpense(id);
        dispatch(deleteItem({ id: id }));
        CloseScreen();
    }
    function cancelHandler() {
        CloseScreen();
    }
    function confirmHandler() {
        CloseScreen();
        // dispatch(addItem());
    }
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <CustiomButton mode='flat' onPress={cancelHandler} outerstyle={styles.button}>Cancel</CustiomButton>
                <CustiomButton onPress={confirmHandler} outerstyle={styles.button}>
                    {isEditting ? 'Update' : 'Add'}</CustiomButton>
            </View>
            <View style={styles.deleteContainer} >
                {isEditting &&
                    <IconButton icon="trash"
                        size={36}
                        color={GlobalStyles.colors.error500}
                        onPress={DeleteHandler.bind(this, id)} />}
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800
    },
    button: {
        minWidth: 120,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteContainer: {
        marginTop: 16,
        padding: 8,
        borderTopWidth: 2,
        borderColor: GlobalStyles.colors.primary200,
        alignItems: 'center',
    }
})
export default ManageExpensesScreen;