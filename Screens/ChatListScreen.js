import {
    View, Text, Button, StyleSheet, ScrollView,
    TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import ChatListItem from "../Components/ChatListPage";
import chatList1 from "../Components/assets/chatData/chats.json"
import { auth, db } from "../firebase";
import { collection, getDocs, query, where, orderBy, addDoc, getDoc, doc } from "firebase/firestore";
import { async } from "@firebase/util";
const ChatListScreen = ({ navigation, route }) => {
    const userId = auth.currentUser.uid;
    const [chatList, setchatList] = useState([]);
    const ToChatDetailHandler = (message) => {
        const user1 = message.userTo
        const user2 = message.userFrom
        if (user1 != userId) {
            navigation.navigate("Chat Detail", {
                userSend: userId,
                userReceive: user1
            });
        } else {
            navigation.navigate("Chat Detail", {
                userSend: userId,
                userReceive: user2
            });
        }

    };
    useEffect(() => {
        const Messages = [];
        const q = query(
            collection(db, "messages"),
            where("userFrom", '==', userId),
            orderBy("createdAt", "asc")
        );
        const q2 = query(
            collection(db, "messages"),
            where("userTo", '==', userId),
            orderBy("createdAt", "asc")
        );
        getDocs(q)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    Messages.push(doc.data());
                });
                // console.log(Messages);

            })
            .catch((error) => {
                console.warn(error);
            });
        getDocs(q2)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    Messages.push(doc.data());
                });
                setchatList(() => {
                    const sortedMessages = [...Messages].sort(
                        (a, b) => {
                            const date1 = new Date(a.createdAt);
                            const date2 = new Date(b.createdAt);
                            return date2.getTime() - date1.getTime();
                        }
                    );
                    const list = []
                    const set = new Set()
                    sortedMessages.forEach(message => {
                        const user1 = message.userTo
                        const user2 = message.userFrom

                        if (user1 !== userId) {
                            if (set.has(user1) === false) {
                                set.add(user1);
                                list.push(message);
                            }
                        }
                        else if (user2 != userId) {
                            if (set.has(user2) === false) {
                                set.add(user2);
                                list.push(message)
                            }
                        }
                    })

                    return list;
                });
            })
            .catch((error) => {
                console.warn(error);
            });
    }, []);
    // const getChatInfo = async (item) => {
    //     receiverId = userId === item.userTo ? item.userFrom : item.userTo;
    //     const docRef = doc(db, 'users', receiverId);
    //     await getDoc(docRef).then((doc) => {
    //         const data = doc.data();
    //         const chatInfo = {
    //             image: data.image,
    //             username: data.username,
    //             createdAt: item.createdAt,
    //             text: item.text,
    //         }
    //     });
    //     return chatInfo;
    // }
    return (
        <ScrollView
            sytle={styles.container}
        >
            {
                chatList.map((item) => {
                    return (
                        <TouchableOpacity onPress={ToChatDetailHandler.bind(this, item)}>
                            <ChatListItem chatInfo={item} />
                        </TouchableOpacity>
                    )
                }
                )
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