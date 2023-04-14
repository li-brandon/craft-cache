import {
    View, Text, Button, StyleSheet, ScrollView,
    TouchableOpacity
} from "react-native";
import ChatListItem from "../Components/ChatListPage";
import chatList from "../Components/assets/chatData/chats.json"
import { auth, db } from "../firebase";
const ChatListScreen = ({ navigation, route }) => {
    const userId = auth.currentUser.uid;
    const ToChatDetailHandler = (UserReceive) => {
        navigation.navigate("Chat Detail", {
            userSend: userId,
            userReceive: UserReceive
        });
    };
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
                    <TouchableOpacity onPress={ToChatDetailHandler.bind(this, item.id)}>
                        <ChatListItem chatInfo={item} />
                    </TouchableOpacity>
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