import {
    View, Text, FlatList,
    ImageBackground, StyleSheet, KeyboardAvoidingView
} from "react-native";
import React, { useEffect, useState } from "react";
import bg from "../Components/assets/chatImages/BG.png";
import Message from "../Components/ChatDetailPage/Message";

import InputBox from "../Components/ChatDetailPage/InputBox";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where, orderBy, addDoc, getDoc, doc } from "firebase/firestore";
import MessageObject from "../models/MessageObject.js";

const ChatScreen = ({ navigation, route }) => {
    navigation.setOptions({ title: "" });

    userFrom = route.params.userSend;
    userTo = route.params.userReceive;
    const userId = auth.currentUser.uid;
    const [docRef, setDocRef] = useState(null);
    const [messages, setMessages] = useState([]);
    const [refreshTime, setRefreshTime] = useState(0);
    const [time, setTime] = useState(new Date());
    const fetchData = () => {
        // console.log("fetch")
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
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
            fetchData();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const onSent = (input) => {
        const now = new Date();
        const msg = {
            createdAt: now.toISOString(),
            userFrom: userFrom,
            userTo: userTo,
            text: input
        };
        setDocRef(addDoc(collection(db, "messages"), msg));
    };
    // useEffect(() => {
    //     console.log("effect fetchtest")
    //     const newMessages = [];
    //     const q = query(
    //         collection(db, "messages"),
    //         where("userFrom", '==', userFrom),
    //         where("userTo", '==', userTo),
    //         orderBy("createdAt", "asc")
    //     );
    //     const q2 = query(
    //         collection(db, "messages"),
    //         where("userFrom", '==', userTo),
    //         where("userTo", '==', userFrom),
    //         orderBy("createdAt", "asc")
    //     );
    //     getDocs(q)
    //         .then((querySnapshot) => {
    //             querySnapshot.forEach((doc) => {
    //                 newMessages.push(doc.data());
    //             });
    //         })
    //         .catch((error) => {
    //             console.warn(error);
    //         });
    //     getDocs(q2)
    //         .then((querySnapshot) => {
    //             querySnapshot.forEach((doc) => {
    //                 newMessages.push(doc.data());
    //             });
    //             setMessages((prevMessages) => {
    //                 const sortedMessages = [...newMessages].sort(
    //                     (a, b) => {
    //                         const date1 = new Date(a.createdAt);
    //                         const date2 = new Date(b.createdAt);
    //                         return date2.getTime() - date1.getTime();
    //                     }
    //                 );
    //                 return sortedMessages;
    //             });
    //         })
    //         .catch((error) => {
    //             console.warn(error);
    //         });
    // }, [userId, docRef]);
    // console.log("important", messages);
    useEffect(() => {
        const docRef = doc(db, 'users', userTo);
        getDoc(docRef).then((doc) => {
            navigation.setOptions({ title: doc.data().username });
        });

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
                <Text>The current time is: {time.toLocaleTimeString()}</Text>
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
