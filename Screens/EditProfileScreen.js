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
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import Icon from "react-native-vector-icons/MaterialIcons";

const EditProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  //TODO: Implement these fields
  const [bio, setBio] = useState("");
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        async function fetchOriginalData() {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUsername(docSnap.data().username);
            setEmail(docSnap.data().email);
            setPassword(docSnap.data().password);
            setPhone(docSnap.data().phone);
            setImage(docSnap.data().image);
          }
        }
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
    const userInformation = {
      username: username,
      email: email,
      phone: phone,
      password: password,
      bio: bio,
      image: image,
    };

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          if (imageUri) {
            const snapshot = await uploadImageAsync(imageRef, imageUri);
            const downloadURL = await getDownloadURL(snapshot.ref);
            userInformation.image = downloadURL;
          }

          await updateDoc(doc(db, "users", user.uid), userInformation);
          Alert.alert("Changes saved");
          navigation.navigate("User Profile");
        } catch (error) {
          console.log("Error adding document: ", error);
        }

        // try {
        //   updateDoc(doc(db, "users", user.uid), {
        //     username: username,
        //     email: email,
        //     phone: phone,
        //     password: password,
        //     bio: bio,
        //     image: image,
        //   });
        //   // clearFields();
        //   Alert.alert("Changes saved");
        //   navigation.navigate("User Profile");
        // } catch (error) {
        //   console.error("Error adding document: ", error);
        // }
      } else {
        console.log("User not logged in");
      }
    });

    return unsubscribe;
  };

  // uploadImageAsync uploads the image to storage and returns the snapshot of the upload
  const uploadImageAsync = async (imageRef, uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return uploadBytes(imageRef, blob);
  };

  // choosePhoto launches the image picker and allows the user to choose a photo
  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user didn't cancel the image picker, convert the image to JPEG, upload the image to storage, and set the image in state
    if (!result.canceled) {
      const uri = result.assets[0].uri; // Get the uri of the image
      try {
        const manipResult = await manipulateAsync(
          uri,
          [{ resize: { width: 500 } }],
          { compress: 0.5, format: SaveFormat.JPEG }
        );
        const imageRef = ref(storage, "profileImages/" + uri.split("/").pop());
        setImageUri(manipResult.uri);
        setImageRef(imageRef);
        setImage(manipResult.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // takePhoto launches the camera and allows the user to take a photo
  const takePhoto = async () => {
    // Check if the user has granted camera permissions
    const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      // If the user has not granted camera permissions, request them
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // If the user cancels the camera, return
    if (!result.canceled) {
      const uri = result.assets[0].uri; // Get the uri of the image
      try {
        const manipResult = await manipulateAsync(
          uri,
          [{ resize: { width: 500 } }],
          { compress: 0.5, format: SaveFormat.JPEG }
        );
        const imageRef = ref(storage, "profileImages/" + uri.split("/").pop());
        setImageUri(manipResult.uri);
        setImageRef(imageRef);
        setImage(manipResult.uri);
      } catch (error) {
        console.log(error);
      }
    }
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
      <View style={styles.imageContainer}>
        {!image && (
          <View style={styles.imagePlaceholder}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.imagePlaceholderText}>Choose an image</Text>
              <Text style={styles.requiredAsterisk}>*</Text>
            </View>
            <View style={styles.icons}>
              <TouchableOpacity onPress={choosePhoto}>
                <Icon name="image" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={takePhoto}>
                <Icon name="photo-camera" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {image && (
          <View style={styles.imageWithButtons}>
            <TouchableOpacity onPress={choosePhoto}>
              <Icon name="image" size={30} color="black" />
            </TouchableOpacity>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity onPress={takePhoto}>
              <Icon name="photo-camera" size={30} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      <TextInput
        style={styles.bio}
        placeholder="Bio"
        editable
        multiline
        numberOfLines={4}
        maxLength={40}
        value={bio}
        onChangeText={(text) => setBio(text)}
      />
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
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 10,
    margin: 10,
    marginTop: 0,
  },
  imageWithButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    alignItems: "center",
    marginTop: 10,
  },
  imagePlaceholder: {
    width: 170,
    height: 170,
    borderRadius: 10,
    backgroundColor: "#dbdbda",
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 17,
    fontWeight: "bold",
    padding: 5,
  },
});

export default EditProfileScreen;
