import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";

const PostComments = () => {
  const [comments, setComments] = useState([]);

  const handleSubmitComment = (comment) => {
    setComments([...comments, comment]);
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item}</Text>
        <TouchableOpacity>
          <Text>Reply</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View>
        <TextInput placeholder="Add a comment..." />
        <TouchableOpacity onPress={() => handleSubmitComment("new comment")}>
          <Text>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostComments;
