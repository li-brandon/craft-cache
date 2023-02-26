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
import { MyContext } from "../Contexts/MyContext";
import { auth, db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const AddProjectScreen = ({ navigation }) => {
  // States
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [tools, setTools] = useState("");
  const [materials, setMaterials] = useState("");
  const [pattern, setPattern] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  // Get the user id from firebase auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user.uid);
      } else {
        // TODO: User is not logged in if we reached here but we haven't handled yet. So
        // for now we will hardcode user id
        setUser("JzDTobXLRSPMIw7G86sjQxR9REd2");
      }
    });

    // Clean up the subscription on unmount
    return unsubscribe;
  }, []);

  // Helper functions

  // handleAddProject is called when the user clicks the "Add Project" button. It will
  // upload the image to storage, add the project to Firestore, and clear the fields
  const handleAddProject = async () => {
    const newProject = {
      name: name,
      type: type,
      tools: tools.split(","), // split tools string into array
      materials: materials.split(","), // split materials string into array
      pattern: pattern,
      description: description,
      userID: user,
      image: image,
    };

    const date = getCurrentDate();
    newProject.startDate = date;
    newProject.lastUpdated = date;
    newProject.inProgress = true;
    newProject.posted = false;

    try {
      // Upload the image to storage and get the download URL
      if (imageUri) {
        const snapshot = await uploadImageAsync(imageRef, imageUri);
        const downloadURL = await getDownloadURL(snapshot.ref);
        newProject.image = downloadURL;
      }

      // Add the new project to Firestore
      await addDoc(collection(db, "projects"), newProject);
      clearFields();
      Alert.alert("Project added successfully");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
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
      const imageRef = ref(storage, "projectImages/" + uri.split("/").pop());
      setImageUri(manipResult.uri);
      setImageRef(imageRef);
      setImage(manipResult.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // takePhoto launches the camera and allows the user to take a photo with the camera
  // const takePhoto = async () => {
  //   const result = await ImagePicker.launchCameraAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   // If the user didn't cancel the camera, upload the image to storage and set the image in state
  //   if (!result.canceled) {
  //     const uri = result.assets[0].uri; // Get the uri of the image
  //     const imageRef = ref(storage, "projectImages/" + uri.split("/").pop());
  //     setImageUri(uri);
  //     setImageRef(imageRef);
  //     setImage(uri);
  //   } else {
  //     alert("Camera permission is required to take a photo.");
  //   }
  // };

  // getCurrentDate returns the current date in the format MM/DD/YYYY
  const getCurrentDate = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  };

  // clearFields clears the fields in the form
  const clearFields = () => {
    setName("");
    setType("");
    setTools("");
    setMaterials("");
    setPattern("");
    setDescription("");
    setImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a new project</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Project type"
          value={type}
          onChangeText={(text) => setType(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tools"
          value={tools}
          onChangeText={(text) => setTools(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Materials"
          value={materials}
          onChangeText={(text) => setMaterials(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Pattern"
          value={pattern}
          onChangeText={(text) => setPattern(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />

        {image && <Image source={{ uri: image }} style={styles.projectImage} />}

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Button title="Choose Photo" onPress={choosePhoto} />
          {/* <Button title="Take Photo" onPress={takePhoto} /> */}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddProject}>
        <Text style={styles.buttonText}>Add Project</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FF6F61",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  projectImage: {
    width: 130,
    height: 130,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});

export default AddProjectScreen;