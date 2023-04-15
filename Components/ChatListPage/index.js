import { View, Text, Image, StyleSheet } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where, orderBy, addDoc, getDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
dayjs.extend(relativeTime);
const ChatListItem = ({ chatInfo }) => {
    const userId = auth.currentUser.uid;
    const [userImage, setUserImage] = useState("");
    const [username, setUserName] = useState("");
    // const [username,setUserName] = useState("");
    useEffect(() => {
        const receiverId = userId === chatInfo.userTo ? chatInfo.userFrom : chatInfo.userTo;
        const docRef = doc(db, 'users', receiverId);
        getDoc(docRef).then((doc) => {
            const data = doc.data();
            setUserImage(data.image);
            setUserName(data.username);
            // const chatInfo = {
            //     image: data.image,
            //     username: data.username,
            //     createdAt: item.createdAt,
            //     text: item.text,
            // }
        });
    }, [username])
    return (
        <View style={styles.container}>
            {/* User Avatar */}
            <Image source={{
                uri: userImage ? userImage : "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/1.jpg"
            }} style={styles.image} />

            {/* content */}
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>
                        {username ? username : "unknown"}
                    </Text>

                    <Text style={styles.subTitle}>
                        {dayjs(chatInfo.createdAt).fromNow()}
                    </Text>
                </View>

                <Text style={styles.subTitle} numberOfLines={2}>
                    {chatInfo.text}
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