import { View, Text, Image, StyleSheet } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const ChatListItem = ({ chatInfo }) => {
    return (
        <View style={styles.container}>
            {/* User Avatar */}
            <Image source={{ uri: chatInfo.user.image }} style={styles.image} />

            {/* content */}
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>
                        {chatInfo.user.name}
                    </Text>

                    <Text style={styles.subTitle}>
                        {dayjs(chatInfo.lastMessage.createdAt).fromNow()}
                    </Text>
                </View>

                <Text style={styles.subTitle} numberOfLines={2}>
                    {chatInfo.lastMessage.content}
                </Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "stretch",
        marginHorizontal: 10,
        marginVertical: 5,
        height: 70,
    },
    image: {
        width: 60,
        aspectRatio: 1,
        borderRadius: 30,
        marginRight: 10,
    },
    content: {
        flex: 1,
        borderBottomColor: "lightgray",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    row: {
        flexDirection: "row",
        marginBottom: 5,
    },
    name: {
        fontWeight: "bold",
        flex: 1,
    },
    subTitle: {
        color: "grey",
    },
});
export default ChatListItem;