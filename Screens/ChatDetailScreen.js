import {
    View, Text, FlatList,
    ImageBackground, StyleSheet, KeyboardAvoidingView
} from "react-native";
import React, { useEffect } from "react";
import bg from "../Components/assets/chatImages/BG.png";
import Message from "../Components/ChatDetailPage/Message";
import messages from "../Components/assets/chatData/messages.json";
import InputBox from "../Components/ChatDetailPage/InputBox";

const ChatScreen = ({ navigation, route }) => {
    console.log(route.params.userSend);
    console.log(route.params.userReceive);
    useEffect(() => {
        navigation.setOptions({ title: "FOR USERNAME" });
    }, [route.params]);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
            style={styles.bg}
        >
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => <Message message={item} />}
                    style={{ padding: 10 }}
                    inverted
                />
                <InputBox />
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};
export default ChatScreen;
const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
});
