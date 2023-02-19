import { View, Text, Button } from "react-native";

function UserProfileScreen({ navigation }) {
  return (
    <View>
      <Text>User Profile Screen</Text>
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate("Edit Profile")}
      />
    </View>
  );
}
export default UserProfileScreen;
