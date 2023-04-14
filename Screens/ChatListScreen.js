import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import ChatListItem from "../Components/ChatListPage";

const chatList = [1, 2, 3, 4, 5];
const ChatListScreen = ({ navigation }) => {
    return (
        // <View style={styles.container}>
        //     <ChatListItem />
        // </View>
        <ScrollView
            contentContainerStyle={styles.container}
        >
            {
                chatList.map((item) => (
                    <ChatListItem />
                ))
            }
        </ScrollView >

    );
};

export default ChatListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});