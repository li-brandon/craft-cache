import { Pressable, View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../Constants/styles";

function CustiomButton({ children, onPress, mode, outerstyle }) {
    return (
        <View style={outerstyle}>
            <Pressable onPress={onPress}>
                <View style={[styles.button, mode == 'flat' && styles.flat]}>
                    <Text style={[styles.buttonText, mode = 'flat' && styles.flatText]}>{children}</Text>
                </View>
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    button: {
        padding: 8,
        borderRadius: 4,
        backgroundColor: GlobalStyles.colors.primary500,

    },
    flat: {
        backgroundColor: 'transparent'
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    },
    flatText: {
        color: GlobalStyles.colors.primary200,

    },
    pressed: {
        opacity: 0.75,
        backgroundColor: GlobalStyles.colors.primary100,
        borderRadius: 4
    }
})

export default CustiomButton