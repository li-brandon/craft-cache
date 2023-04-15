import {
    View, Text, FlatList,
    ImageBackground, StyleSheet, KeyboardAvoidingView
} from "react-native";
import React, { useEffect, useState } from "react";
import bg from "../Components/assets/chatImages/BG.png";
import Message from "../Components/ChatDetailPage/Message";
// import messages from "../Components/assets/chatData/messages.json";
import InputBox from "../Components/ChatDetailPage/InputBox";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where, orderBy, addDoc } from "firebase/firestore";
import MessageObject from "../models/MessageObject.js";
const ChatScreen = ({ navigation, route }) => {
    console.log(route.params.userSend);
    console.log(route.params.userReceive);
    userFrom = route.params.userSend;
    userTo = route.params.userReceive;
    const userId = auth.currentUser.uid;
    const [docRef, setDocRef] = useState(null);
    const [messages, setMessages] = useState([]);
    const onSent = (input) => {
        console.warn("Sent", input, userFrom, userTo);
        const now = new Date();
        const msg = {
            createdAt: now.toISOString(),
            userFrom: userTo,
            userTo: userFrom,
            text: input
        };
        setDocRef(addDoc(collection(db, "messages"), msg));
    };
    useEffect(() => {
        const newMessages = [];
        const q = query(
            collection(db, "messages"),
            where("userFrom", '==', userFrom),
            where("userTo", '==', userTo),
            orderBy("createdAt", "asc")
        );
        const q2 = query(
            collection(db, "messages"),
            where("userFrom", '==', userTo),
            where("userTo", '==', userFrom),
            orderBy("createdAt", "asc")
        );
        getDocs(q)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    newMessages.push(doc.data());
                });
            })
            .catch((error) => {
                console.warn(error);
            });
        getDocs(q2)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    newMessages.push(doc.data());
                });
                setMessages((prevMessages) => {
                    const sortedMessages = [...newMessages].sort(
                        (a, b) => {
                            const date1 = new Date(a.createdAt);
                            const date2 = new Date(b.createdAt);
                            return date2.getTime() - date1.getTime();
                        }
                    );
                    return sortedMessages;
                });
            })
            .catch((error) => {
                console.warn(error);
            });
    }, [userId, docRef]);
    console.log("important", messages);
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
                    renderItem={({ item }) => <Message message={item} userId={userId} />}
                    style={{ padding: 10 }}
                    inverted
                />
                <InputBox onSent={onSent} />
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
