import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";

import hat from "../assets/flower-bucket-hat.jpg";

const PostComments = () => {
  const [comments, setComments] = useState([]);

  const handleSubmitComment = (comment, profileIcon) => {
    setComments([...comments, { comment, profileIcon }]);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.commentContainer}>
        <Image source={item.profileIcon} style={styles.profileIcon} />
        <Text style={styles.commentText}>{item.comment}</Text>
        <TouchableOpacity>
          <Text style={styles.replyButton}>Reply</Text>
        </TouchableOpacity>
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
          //   source={require("./user-profile-icon.png")}
          source={hat}
          style={styles.profileIcon}
        />
        <TextInput placeholder="Add a comment..." style={styles.input} />
        <TouchableOpacity
          onPress={() =>
            handleSubmitComment(
              "new comment",
              //   require("./user-profile-icon.png")
              hat
            )
          }
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

export default PostComments;
