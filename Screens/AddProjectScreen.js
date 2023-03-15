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
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { MyContext } from "../Contexts/MyContext";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/MaterialIcons";

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
      !pattern ||
      !description ||
      !image ||
      typeValues.length === 0 ||
      toolsValues.length === 0 ||
      materialsValues.length === 0
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
    <KeyboardAvoidingView
      // behavior prop should be position
      behavior={Platform.OS === "ios" ? "position" : "height"}
      keyboardVerticalOffset={10}
    >
      <View style={styles.project}>
        <View>
          <View style={styles.projectInfoAndImage}>
            <View style={styles.imageContainer}>
              {!image && (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>
                    Choose an image
                  </Text>
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
            <View style={styles.projectStatusAndPostStatus}>
              <View style={styles.projectInfo}>
                <View
                  style={{
                    display: "flex",
                    alignContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text style={styles.projectInfoText}>Name: </Text>
                  {/* if edit state is true, show input text. If not true, show the name as Text*/}
                  <TextInput
                    style={styles.inputField}
                    returnKeyType="done"
                    onChangeText={(text) => setName(text)}
                    value={name}
                  />
                </View>

                <View
                  style={[
                    styles.rowWithWrappers,
                    typeDropDownIsOpen && { alignItems: "flex-start" },
                  ]}
                >
                  <Text style={styles.projectInfoText}>Type: </Text>
                  {/* if edit state is true, show drop down picker. If not true, show the types as Text*/}
                  <View
                    style={{ flex: 1, height: typeDropDownIsOpen ? 230 : 50 }}
                  >
                    <DropDownPicker
                      open={typeDropDownIsOpen}
                      value={typeValues}
                      items={typeItems}
                      setOpen={setTypeDropDownIsOpen}
                      setValue={setTypeValues}
                      setItems={setTypeItems}
                      multiple={true}
                      mode="BADGE"
                      listItemContainerStyle={{ height: 30 }}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.rowWithWrappers,
                    toolsDropDownIsOpen && { alignItems: "flex-start" },
                  ]}
                >
                  <Text style={styles.projectInfoText}>Tools: </Text>
                  {/* if edit state is true, show drop down picker. If not true, show the types as Text*/}
                  <View
                    style={{
                      flex: 1,
                      height: toolsDropDownIsOpen ? 230 : 50,
                    }}
                  >
                    <DropDownPicker
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
                </View>

                <View
                  style={[
                    styles.rowWithWrappers,
                    materialsDropDownIsOpen && { alignItems: "flex-start" },
                  ]}
                >
                  <Text style={styles.projectInfoText}>Materials: </Text>
                  <View
                    style={{
                      flex: 1,
                      height: materialsDropDownIsOpen ? 230 : 50,
                    }}
                  >
                    <DropDownPicker
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
                </View>

                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      display: "flex",
                      alignContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.projectInfoText}>Pattern: </Text>
                    {/* if edit state is true, show input text. If not true, show the name as Text*/}
                    <TextInput
                      style={styles.inputField}
                      returnKeyType="done"
                      onChangeText={(text) => setPattern(text)}
                      value={pattern}
                    />
                  </View>
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.projectInfoText}>Description: </Text>
                  <View style={styles.projectDescriptionContainer}>
                    <TextInput
                      style={styles.descriptionInputField}
                      editable
                      multiline
                      numberOfLines={4}
                      onKeyPress={({ nativeEvent }) => {
                        // dismiss keyboard when enter is pressed
                        if (nativeEvent.key === "Enter") {
                          Keyboard.dismiss();
                        }
                      }}
                      returnKeyType="done"
                      onChangeText={(text) => setDescription(text)}
                      value={description}
                    />
                  </View>
                </View>
                <View style={styles.clearAddButtons}>
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearFields}
                  >
                    <Text style={styles.buttonText}>Clear</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.addProjectButton}
                    onPress={handleAddProject}
                  >
                    <Text style={styles.buttonText}>Add Project</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  project: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 10,
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
  },

  inputField: {
    height: 27,
    width: 150,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 14,
  },

  projectName: {
    marginBottom: 5,
    alignItems: "center",
  },

  projectNameAndPatternText: {
    fontSize: 17,
  },

  projectInfoAndImage: {
    flexDirection: "column",
    marginBottom: 5,
  },

  projectInfo: {
    width: "100%",
  },

  projectInfoText: {
    fontSize: 17,
    fontWeight: "bold",
  },

  projectTypeText: {
    flexDirection: "row",
  },

  projectToolsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  imagePlaceholder: {
    width: 150,
    height: 150,
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

  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },

  image: {
    marginTop: 16,
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 10,
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

  projectStatusAndPostStatus: {
    flexDirection: "column",
  },

  projectStatus: {
    width: "60%",
  },

  postStatus: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    width: "100%",
  },

  projectStatusText: {
    fontSize: 13,
    color: "grey",
  },

  postStatusText: {
    fontSize: 17,
    fontWeight: "bold",
  },

  rowWithWrappers: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },

  wrappers: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    maxWidth: "80%",
  },

  wrapper: {
    backgroundColor: "#ECF3F9",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 12,
    padding: 2,
    paddingLeft: 17,
    paddingRight: 17,
    margin: 5,
    marginTop: 0,
  },

  wrapperText: {
    fontSize: 13,
  },

  projectDescriptionContainer: {
    marginLeft: 3,
    marginTop: 10,
  },

  projectDescriptionText: {
    fontSize: 14,
  },

  descriptionInputField: {
    height: 80,
    width: "98%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
  },

  editBtnContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },

  editBtn: {
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    fontWeight: "bold",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 2,
    height: 30,
    paddingLeft: 15,
    paddingRight: 15,
    margin: 5,
    marginTop: 0,
  },

  editBtnText: {
    fontSize: 15,
    fontWeight: "bold",
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  clearAddButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  addProjectButton: {
    backgroundColor: "#FF6F61",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },

  clearButton: {
    backgroundColor: "#9a9a9a",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddProjectScreen;
