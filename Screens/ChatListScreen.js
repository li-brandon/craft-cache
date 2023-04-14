import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import ChatListItem from "../Components/ChatListPage";
import chatList from "../Components/assets/chatData/chats.json"
const ChatListScreen = ({ navigation, route }) => {
    console.log(route.params.userId);
    return (
        // <View style={styles.container}>
        //     <ChatListItem />
        // </View>
        <ScrollView
            // contentContainerStyle={styles.container}
            sytle={styles.container}
        >
            {
                chatList.map((item) => (
                    < ChatListItem chatInfo={item} />
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
        // alignItems: "center",
        // justifyContent: "center",
    },
});