import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";

const CommentsScreen = () => {
  const [comments, setComments] = useState([]);

  const handleCommentSubmit = (comment) => {
    setComments([...comments, comment]);
  };

  const handleReplySubmit = (reply, commentIndex) => {
    const updatedComments = [...comments];
    updatedComments[commentIndex].replies.push(reply);
    setComments(updatedComments);
  };

  const renderItem = ({ item, index }) => (
    <View>
      <Text>{item.comment}</Text>
      <FlatList
        data={item.replies}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        placeholder="Enter your reply"
        onSubmitEditing={(e) => handleReplySubmit(e.nativeEvent.text, index)}
      />
    </View>
  );

  return (
    <View>
      <Text>Comments</Text>
      <TextInput
        placeholder="Enter your comment"
        onSubmitEditing={(e) =>
          handleCommentSubmit({ comment: e.nativeEvent.text, replies: [] })
        }
      />
      <Button title="Submit" onPress={() => {}} />
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default CommentsScreen;
