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
  Keyboard,
  ScrollView
} from "react-native";
import { MyContext } from "../Contexts/MyContext";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import DropDownPicker from "react-native-dropdown-picker";

const AddProjectScreen = ({ navigation }) => {
  // States
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [pattern, setPattern] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  // DropDownPicker states
  const [typeDropDownIsOpen, setTypeDropDownIsOpen] = useState(false);
  const [toolsDropDownIsOpen, setToolsDropDownIsOpen] = useState(false);
  const [materialsDropDownIsOpen, setMaterialsDropDownIsOpen] = useState(false);
  const [typeValues, setTypeValues] = useState([]);
  const [toolsValues, setToolsValues] = useState([]);
  const [materialsValues, setMaterialsValues] = useState([]);

  const [typeItems, setTypeItems] = useState([
    { label: "Knitting", value: "Knitting" },
    { label: "Crochet", value: "Crochet" },
    { label: "Sewing", value: "Sewing" },
    { label: "Embroidery", value: "Embroidery" },
    { label: "Weaving", value: "Weaving" },
    { label: "Tailoring", value: "Tailoring" },
  ]);

  // These will be fetched from Firestore
  const [toolsItems, setToolsItems] = useState([]);
  const [materialsItems, setMaterialsItems] = useState([]);

  // Get the user id from firebase auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchItemsFromInventory(user.uid);
        setUser(user.uid);
      } else {
        // Redirect to login screen if user is not logged in
        navigation.navigate("Login");
      }
    });

    // Clean up the subscription on unmount
    return unsubscribe;
  }, []);

  //fetchItemsFromInventory fetches the user's inventory items from Firestore
  const fetchItemsFromInventory = async (userID) => {
    const q = query(collection(db, "inventory"), where("userID", "==", userID));
    const querySnapshot = await getDocs(q);

    // first we get all the tools and materials from the user's inventory
    const allTools = [];
    const allMaterials = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().toolOrMaterial === "Tool") {
        allTools.push(doc.data().name);
      } else {
        allMaterials.push(doc.data().name);
      }
    });

    // convert tools, materials to the format that the dropdown picker needs
    convertedTools = allTools.map((item) => {
      return { label: item, value: item };
    });
    convertedMaterials = allMaterials.map((item) => {
      return { label: item, value: item };
    });

    // set the states to the values that the dropdown pickers need
    setToolsItems(convertedTools);
    setMaterialsItems(convertedMaterials);
  };

  // handleAddProject is called when the user clicks the "Add Project" button. It will
  // upload the image to storage, add the project to Firestore, and clear the fields
  const handleAddProject = async () => {
    // // Check if the user has entered all the required fields.
    if (
      !name ||
      !typeValues ||
      !toolsValues ||
      !materialsValues ||
      !pattern ||
      !description ||
      !image
    ) {
      Alert.alert("Please fill in all the required fields");
      return;
    }

    // Check if user has logged in
    if (!user) {
      Alert.alert("Please log in to add a project");
      return;
    }

    const newProject = {
      name: name,
      type: typeValues,
      tools: toolsValues,
      materials: materialsValues,
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
        const imageRef = ref(storage, "projectImages/" + uri.split("/").pop());
        setImageUri(manipResult.uri);
        setImageRef(imageRef);
        setImage(manipResult.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

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
    setTypeValues([]);
    setToolsValues([]);
    setMaterialsValues([]);
    setPattern("");
    setDescription("");
    setImage(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add a new project</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          returnKeyType="done"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <View style={{ flex: 1, height: typeDropDownIsOpen ? 250 : 50 }}>
          <DropDownPicker
            placeholder="Select type(s)"
            open={typeDropDownIsOpen}
            value={typeValues}
            items={typeItems}
            setOpen={setTypeDropDownIsOpen}
            setValue={setTypeValues}
            setItems={setTypeItems}
            multiple={true}
            mode="BADGE"
            listItemContainerStyle={{ height: 33 }}
          />
        </View>
        <View style={{ flex: 1, height: toolsDropDownIsOpen ? 200 : 50 }}>
          <DropDownPicker
            placeholder="Select tool(s)"
            open={toolsDropDownIsOpen}
            value={toolsValues}
            items={toolsItems}
            setOpen={setToolsDropDownIsOpen}
            setValue={setToolsValues}
            setItems={setToolsItems}
            multiple={true}
            mode="BADGE"
            listItemContainerStyle={{ height: 33 }}
          />
        </View>
        <View style={{ flex: 1, height: materialsDropDownIsOpen ? 250 : 50 }}>
          <DropDownPicker
            placeholder="Select material(s)"
            open={materialsDropDownIsOpen}
            value={materialsValues}
            items={materialsItems}
            setOpen={setMaterialsDropDownIsOpen}
            setValue={setMaterialsValues}
            setItems={setMaterialsItems}
            multiple={true}
            mode="BADGE"
            listItemContainerStyle={{ height: 33 }}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Pattern"
          returnKeyType="done"
          value={pattern}
          onChangeText={(text) => setPattern(text)}
        />
        <TextInput
          style={styles.description}
          placeholder="Description"
          returnKeyType="done"
          editable
          multiline
          numberOfLines={4}
          value={description}
          onKeyPress={({ nativeEvent }) => {
            // dismiss keyboard when enter is pressed
            if (nativeEvent.key === "Enter") {
              Keyboard.dismiss();
            }
          }}
          blurOnSubmit={true} // prevent new line when return button is pressed
          onChangeText={(text) => {
            if (text.trim() === "") {
              // prevent user from entering only whitespace
              setDescription("");
            } else {
              setDescription(text);
            }
          }}
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
    </ScrollView>
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
  description: {
    height: 100,
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
