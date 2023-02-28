import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Button,
} from "react-native";

import { auth, db, storage } from "../firebase";
import { doc, collection, addDoc, updateDoc, getDoc } from "firebase/firestore";

const EditProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  //TODO: Implement these fields
  const [bio, setBio] = useState("");
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const fetchOriginalData = async () => {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUsername(docSnap.data().username);
            setEmail(docSnap.data().email);
            setPassword(docSnap.data().password);
            setPhone(docSnap.data().phone);
          }
        };
        fetchOriginalData();
      } else {
        // Redirect to login screen if user is not logged in
        navigation.navigate("Login");
      }
    });

    // Clean up the subscription on unmount
    return unsubscribe;
  }, []);

  const handleSave = async () => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        try {
          updateDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            phone: phone,
            password: password,
            bio: bio,
          });
          // clearFields();
          Alert.alert("Changes saved");
          navigation.navigate("User Profile");
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      } else {
        console.log("User not logged in");
      }
    });

    return unsubscribe;
  };

  const handleChooseAvatar = () => {
    // TODO: Implement avatar selection logic
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.avatarContainer}>
        {avatar ? (
          <Image style={styles.avatar} source={{ uri: avatar }} />
        ) : (
          <TouchableOpacity
            style={styles.avatarPlaceholder}
            onPress={handleChooseAvatar}
          >
            <Text style={styles.avatarPlaceholderText}>Choose Avatar</Text>
          </TouchableOpacity>
        )}
      </View> */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      {/* <TextInput
        style={styles.bio}
        placeholder="Bio"
        editable
        multiline
        numberOfLines={4}
        maxLength={40}
        value={bio}
        onChangeText={(text) => setBio(text)}
      /> */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    marginBottom: 20,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#CCCCCC",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  bio: {
    width: "100%",
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  saveButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#1E90FF",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default EditProfileScreen;
