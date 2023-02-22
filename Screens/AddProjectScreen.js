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
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

const AddProjectScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [tools, setTools] = useState("");
  const [materials, setMaterials] = useState("");
  const [pattern, setPattern] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Get the user id from firebase auth
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

  const handleAddProject = () => {
    const newProject = {
      name: name,
      type: type,
      tools: tools.split(","), // split tools string into array
      materials: materials.split(","), // split materials string into array
      pattern: pattern,
      description: description,
      userID: user,
    };

    const date = getCurrentDate();

    newProject.startDate = date;
    newProject.lastUpdated = date;
    newProject.inProgress = true;
    newProject.posted = false;

    // Add new project to db, then clear fields and show alert
    addDoc(collection(db, "projects"), newProject)
      .then(() => {
        clearFields();
        Alert.alert("Project added successfully");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  };

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    } else {
      alert("Camera permission is required to take a photo.");
    }
  };

  const clearFields = () => {
    setName("");
    setType("");
    setTools("");
    setMaterials("");
    setPattern("");
    setDescription("");
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
          <Button title="Take Photo" onPress={takePhoto} />
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
