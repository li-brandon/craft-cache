import { Pressable, View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../Constants/styles";
import { getFormattedDate } from "../../util/Date";
import { useNavigation } from '@react-navigation/native'
function SingleExpenseItem({ itemData }) {
    const navigation = useNavigation();
    function PressHandler() {
        return navigation.navigate('Manage Page',
            {

                id: itemData.item.id,
                content: itemData.item.description

            }
        );
    }
    return (
        <Pressable onPress={PressHandler} style={({ pressed }) => (pressed && styles.pressed)}>
            <View style={styles.outerView}>
                <View>
                    <Text style={[styles.textBase, styles.description]}>id:{itemData.item.id}</Text>
                    <Text style={styles.textBase}>date:{getFormattedDate(itemData.item.date)}</Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amount}>amount:{itemData.item.amount.toFixed(2)}</Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    outerView: {
        padding: 12,
        marginVertical: 8,
        backgroundColor: GlobalStyles.colors.primary500,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 6,
        shadowColor: GlobalStyles.colors.gray500,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
    },
    textBase: {
        color: GlobalStyles.colors.primary50
    },
    pressed: {
        opacity: 0.4,
    },
    description: {
        fontSize: 16,
        marginBottom: 4,
        fontWeight: 'bold',

    },
    amountContainer: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    amount: {
        color: GlobalStyles.colors.primary500,
        fontWeight: 'bold',
        minWidth: 80
    }
})
export default SingleExpenseItem;
