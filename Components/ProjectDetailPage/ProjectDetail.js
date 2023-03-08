import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Button,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";

const ProjectDetail = ({ project, navigation }) => {
  const [projectState, setProjectState] = useState(project);
  const [showButtons, setshowButtons] = useState(false);
  const [edit, setEdit] = useState(false);
  const [typeDropDownIsOpen, setTypeDropDownIsOpen] = useState(false);
  const [toolsDropDownIsOpen, setToolsDropDownIsOpen] = useState(false);
  const [materialsDropDownIsOpen, setMaterialsDropDownIsOpen] = useState(false);

  const [typeValues, setTypeValues] = useState([
    // goes through the projectState.type array and prepares it for the dropdown picker
    ...projectState.type.map((item) => item),
  ]);

  const [toolsValues, setToolsValues] = useState([
    // goes through the projectState.tools array and prepares it for the dropdown picker
    ...projectState.tools.map((item) => item),
  ]);

  const [materialsValues, setMaterialsValues] = useState([
    // goes through the projectState.materials array and prepares it for the dropdown picker
    ...projectState.materials.map((item) => item),
  ]);

  const [typeItems, setTypeItems] = useState([
    { label: "Knitting", value: "Knitting" },
    { label: "Crochet", value: "Crochet" },
    { label: "Sewing", value: "Sewing" },
    { label: "Embroidery", value: "Embroidery" },
    { label: "Weaving", value: "Weaving" },
    { label: "Tailoring", value: "Tailoring" },
  ]);

  const [toolsItems, setToolsItems] = useState(); // will be set to the user's inventory
  const [materialsItems, setMaterialsItems] = useState(); // will be set to the user's inventory

  useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // if the current user is the owner of the project, show the post button
        if (user.uid === projectState.userID) {
          fetchItemsFromInventory();
          setshowButtons(true);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  // fetches the user's inventory from the database and sets the tools and materials dropdowns to the items in the user's inventory
  const fetchItemsFromInventory = async () => {
    const userID = auth.currentUser.uid;
    const q = query(collection(db, "inventory"), where("userID", "==", userID));
    const querySnapshot = await getDocs(q);
    const tools = [];
    const materials = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().type === "tool") {
        tools.push({ label: doc.data().name, value: doc.data().name });
      } else {
        materials.push({ label: doc.data().name, value: doc.data().name });
      }
    });
    // set the tools and materials dropdowns to the items in the user's inventory
    setToolsValues(tools);
    setMaterialsValues(materials);
    setToolsItems(tools);
    setMaterialsItems(materials);
  };

  const handleDeleteProject = async () => {
    // prompt user to confirm deletion
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          // delete project from database after user confirms deletion
          onPress: () => {
            try {
              const projectRef = doc(
                collection(db, "projects"),
                projectState.id
              );
              deleteDoc(projectRef);
              navigation.navigate("Front Page");
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const postOrUnpostProject = async () => {
    // if project is posted, unpost it
    if (projectState.posted) {
      try {
        const projectRef = doc(collection(db, "projects"), projectState.id);
        await updateDoc(projectRef, {
          posted: false,
        });

        // update UI to show that project is not posted
        setProjectState({
          ...projectState,
          posted: false,
        });
      } catch (error) {
        console.error("Error unposting project: ", error);
      }
    } else {
      // if project is not posted, post it
      try {
        const projectRef = doc(collection(db, "projects"), projectState.id);
        await updateDoc(projectRef, {
          posted: true,
        });

        // update UI to show that project is posted
        setProjectState({
          ...projectState,
          posted: true,
        });
      } catch (error) {
        console.error("Error posting project: ", error);
      }
    }
  };

  const handleEditButtonPress = async () => {
    setEdit(!edit); // toggle edit button state

    // if "DONE" button is pressed, update project in database
    if (edit) {
      try {
        // update type array in the projectState to reflect changes made in DropDownPicker
        setProjectState({
          ...projectState,
          type: typeValues,
          tools: toolsValues,
          materials: materialsValues,
        });

        const projectRef = doc(collection(db, "projects"), projectState.id);

        //TODO: rename value to be more descriptive
        await updateDoc(projectRef, {
          name: projectState.name,
          type: typeValues,
          tools: toolsValues,
          materials: materialsValues,
          pattern: projectState.pattern,
          description: projectState.description,
          image: projectState.image,
        });
      } catch (error) {
        console.error("Error updating project: ", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      // behavior prop should be position
      behavior={Platform.OS === "ios" ? "position" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.project}>
        <View>
          {showButtons ? (
            <View style={styles.editBtnContainer}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => handleEditButtonPress()}
              >
                <Text style={styles.editBtnText}>{edit ? "DONE" : "EDIT"}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.projectInfoAndImage}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: projectState.image }}
              />
            </View>
            <View style={styles.postStatus}>
              {projectState.posted ? ( // If project is posted, show "POSTED" text
                <Text style={styles.postStatusText}>POSTED</Text>
              ) : (
                // If project is not posted, show "NOT POSTED" text
                <Text style={styles.postStatusText}>NOT POSTED</Text>
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
                  {edit ? (
                    <TextInput
                      style={styles.inputField}
                      returnKeyType="done"
                      onChangeText={(text) =>
                        setProjectState({ ...projectState, name: text })
                      }
                      value={projectState.name}
                    />
                  ) : (
                    <Text style={styles.projectNameAndPatternText}>
                      {projectState.name}
                    </Text>
                  )}
                </View>

                <View
                  style={[
                    styles.rowWithWrappers,
                    typeDropDownIsOpen && { alignItems: "flex-start" },
                  ]}
                >
                  <Text style={styles.projectInfoText}>Type: </Text>
                  {/* if edit state is true, show drop down picker. If not true, show the types as Text*/}
                  {edit ? (
                    <View
                      style={{ flex: 1, height: typeDropDownIsOpen ? 250 : 50 }}
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
                        listItemContainerStyle={{ height: 33 }}
                      />
                    </View>
                  ) : (
                    <View style={styles.wrappers}>
                      {projectState.type.map((type) => (
                        <View style={styles.wrapper}>
                          <Text style={styles.wrapperText}>{type}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <View style={[
                    styles.rowWithWrappers,
                    typeDropDownIsOpen && { alignItems: "flex-start" },
                  ]}>
                  <Text style={styles.projectInfoText}>Tools: </Text>
                  {/* if edit state is true, show drop down picker. If not true, show the types as Text*/}
                  {edit ? (
                    <View
                      style={{ flex: 1, height: toolsDropDownIsOpen ? 250 : 50 }}
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
                  ) : (
                    <View style={styles.wrappers}>
                      {projectState.tools.map((tool) => (
                        <View style={styles.wrapper}>
                          <Text style={styles.wrapperText}>{tool}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.rowWithWrappers}>
                  <Text style={styles.projectInfoText}>Materials: </Text>
                  {/* if edit state is true, show drop down picker. If not true, show the types as Text*/}
                  {edit ? (
                    <View
                      style={{ flex: 1, height: materialsDropDownIsOpen ? 250 : 50 }}
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
                  ) : (
                    <View style={styles.wrappers}>
                      {projectState.materials.map((material) => (
                        <View style={styles.wrapper}>
                          <Text style={styles.wrapperText}>{material}</Text>
                          </View>
                      ))}
                      </View>
                  )}
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
                    {edit ? (
                      <TextInput
                        style={styles.inputField}
                        returnKeyType="done"
                        onChangeText={(text) =>
                          setProjectState({ ...projectState, pattern: text })
                        }
                        value={projectState.pattern}
                      />
                    ) : (
                      <Text style={styles.projectNameAndPatternText}>
                        {projectState.pattern}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.projectInfoText}>Description: </Text>
                  <View style={styles.projectDescriptionContainer}>
                    {edit ? (
                      <TextInput
                        style={styles.descriptionInputField}
                        editable
                        multiline
                        numberOfLines={4}
                        value={projectState.description}
                        onKeyPress={({ nativeEvent }) => {
                          // dismiss keyboard when enter is pressed
                          if (nativeEvent.key === "Enter") {
                            Keyboard.dismiss();
                          }
                        }}
                        returnKeyType="done"
                        onChangeText={(text) =>
                          setProjectState({
                            ...projectState,
                            description: text,
                          })
                        }
                      />
                    ) : (
                      <Text style={styles.projectDescriptionText}>
                        {projectState.description}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Only show buttons if the project belongs to current signed in user */}
      {showButtons && (
        <View style={styles.buttons}>
          <Button title="Delete Project" onPress={handleDeleteProject} />
          <Button
            title={projectState.posted ? "Unpost Project" : "Post Project"}
            onPress={postOrUnpostProject}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ProjectDetail;

const styles = StyleSheet.create({
  project: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 5,
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

  imageContainer: {
    width: "100%",
    alignItems: "center",
  },

  image: {
    marginTop: 16,
    width: 200,
    height: 200,
    borderRadius: 10,
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
    height: 100,
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
});
