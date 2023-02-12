import { Pressable, StyleSheet, View, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
function IconButton({ icon, size, color, onPress }) {
    return (
        <Pressable onPress={onPress}
            style={({ pressed }) => pressed && styles.pressed}
        >
            <View style={styles.buttonContainer}>
                <Ionicons name={icon} size={size} color={color} />
                {/* <Text style={{ color: 'white' }}>size{size}</Text> */}
            </View>
        </Pressable >
    )
}
const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 24,
        padding: 6,
        marginVertical: 2,
        marginHorizontal: 8
        // backgroundColor: 'white'
    },
    pressed: {
        opacity: 0.75
    }
})
export default IconButton;