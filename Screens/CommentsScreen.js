import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";

import { auth, db } from "../firebase";

import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  addDoc,
} from "firebase/firestore";

import userIcon from "../Components/assets/user-icon.png";

const CommentsScreen = ({ navigation, route }) => {
  const { profileIcon, profileID, name } = route.params;

  const [enteredComment, setEnteredComment] = useState("");
  const [userID, setUserID] = useState("");
  const [projectName, setProjectName] = useState(name);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    setUserID(profileID);

    // TODO: Make a call and get all comments for this post
  }, []);

  const handleSubmitComment = async (comment, icon) => {
    const newComment = {
      content: comment,
      projectName: projectName,
      userID: userID,
      profileIcon: icon,
      timestamp: Date.now(),
    };

    try {
      await addDoc(collection(db, "comments"), newComment);
    } catch (error) {
      console.log("Error adding comment: ", error);
    }

    setComments([...comments, { comment, icon }]);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.commentContainer}>
        <Image
          source={profileIcon ? { uri: profileIcon } : userIcon}
          style={styles.profileIcon}
        />
        <Text style={styles.commentText}>{item.comment}</Text>
        {/* <TouchableOpacity>
          <Text style={styles.replyButton}>Reply</Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.commentList}
      />
      <View style={styles.inputContainer}>
        <Image
          source={profileIcon ? { uri: profileIcon } : userIcon}
          style={styles.profileIcon}
        />
        <TextInput
          placeholder="Add a comment..."
          style={styles.input}
          onChangeText={(newComment) => setEnteredComment(newComment)}
        />
        <TouchableOpacity
          onPress={() => handleSubmitComment(enteredComment, profileIcon)}
        >
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  commentList: {
    marginTop: 16,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  replyButton: {
    color: "#039be5",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    justifyContent: "center", // centers the child elements horizontally
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 16,
    fontSize: 16,
  },
  postButton: {
    color: "#039be5",
    fontSize: 16,
  },
});

export default CommentsScreen;
