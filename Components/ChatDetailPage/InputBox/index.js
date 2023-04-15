import { View, TextInput, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";


const InputBox = ({ onSent }) => {
    const [UserInput, setUserInput] = useState("");
    return (
        <View style={styles.container}>
            <AntDesign name="plus" size={24} color="royalblue" />
            <TextInput style={styles.input}
                multiline={true}
                numberOfLines={4}
                placeholder="Type a message"
                onChangeText={(text) => { setUserInput(text) }}
                value={UserInput} />
            <MaterialIcons style={styles.send}
                name="send" size={24} color="white"
                onPress={() => {
                    onSent(UserInput);
                    setUserInput("");
                }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "whitesmoke",
        padding: 5,
        alignItems: "center",
    },
    input: {
        fontSize: 18,

        flex: 1,
        backgroundColor: "white",
        padding: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,

        borderRadius: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "lightgray",
    },
    send: {
        backgroundColor: "royalblue",
        padding: 7,
        borderRadius: 15,
        overflow: "hidden",
    },
});

export default InputBox;