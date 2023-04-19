import { View, Text, StyleSheet } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GlobalStyles } from "../../../Constants/styles.js";

dayjs.extend(relativeTime);

const Message = ({ message, userId }) => {
    const isMyMessage = () => {
        return message.userFrom === userId;
    };
    const date = new Date(message.createdAt);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isMyMessage() ? GlobalStyles.colors.primary50 : "white",
                    alignSelf: isMyMessage() ? "flex-end" : "flex-start",
                },
            ]}
        >
            <Text>{message.text}</Text>
            <Text style={styles.time}>{dayjs(date).fromNow(true)} ago</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: "80%",

        // Shadows
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,

        elevation: 1,
    },
    message: {},
    time: {
        alignSelf: "flex-end",
        color: "grey",
    },
});

export default Message;