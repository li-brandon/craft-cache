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
  ScrollView,
} from "react-native";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

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

  // states below are the ones that are displayed in DropDownPickers
  const [typeItems, setTypeItems] = useState([
    { label: "Knitting", value: "Knitting" },
    { label: "Crochet", value: "Crochet" },
    { label: "Sewing", value: "Sewing" },
    { label: "Embroidery", value: "Embroidery" },
    { label: "Weaving", value: "Weaving" },
    { label: "Tailoring", value: "Tailoring" },
    { label: "Other", value: "Other" },
  ]);

  const [toolsItems, setToolsItems] = useState(); // will be set to the tools in user's inventory
  const [materialsItems, setMaterialsItems] = useState(); // will be set to the materilas in user's inventory

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
  }, [projectState.userID]);

  /**
   * fetchItemsFromInventory(): fetches the user's inventory from the database
   * and sets the tools and materials dropdowns to the items in the user's inventory
   */
  const fetchItemsFromInventory = async () => {
    const userID = auth.currentUser.uid;
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

    // filter tools, materials to only include the ones that are in the project
    toolsForProject = allTools.filter((item) => {
      return projectState.tools.includes(item);
    });
    materialsForProject = allMaterials.filter((item) => {
      return projectState.materials.includes(item);
    });

    // set the states to the values that the dropdown pickers need
    setToolsValues(toolsForProject);
    setMaterialsValues(materialsForProject);
    setToolsItems(convertedTools);
    setMaterialsItems(convertedMaterials);
  };

  /**
   * handleDeleteProject(): called when user presses the 'Delete' button
   */
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

  /**
   * postOrUnpostProject(): called when user presses POST/UNPOST button.
   * Updates the state of the project to whether project is posted in the database
   */
  const postOrUnpostProject = async () => {
    const userDocRef = doc(db, "users", projectState.userID);

    // if project is posted, unpost it
    if (projectState.posted) {
      try {
        const projectRef = doc(collection(db, "projects"), projectState.id);
        await updateDoc(projectRef, {
          posted: false,
          timePosted: null,
        });

        // update UI to show that project is not posted
        setProjectState({
          ...projectState,
          posted: false,
        });

        await updateDoc(userDocRef, {
          publishedProjects: arrayRemove(doc(db, "projects", projectState.id)),
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
          timePosted: new Date(),
        });

        // update UI to show that project is posted
        setProjectState({
          ...projectState,
          posted: true,
        });

        await updateDoc(userDocRef, {
          publishedProjects: arrayUnion(doc(db, "projects", projectState.id)),
        });
      } catch (error) {
        console.error("Error posting project: ", error);
      }
    }
  };

  /**
   * handleEditButtonPress(): Toggles the edit button to be "EDIT" or "DONE".
   * If EDIT is pressed, user will enter edit mode.
   * If DONE is pressed, project details are updated in the database as well as UI
   */
  const handleEditButtonPress = () => {
    setEdit(!edit); // toggle edit button state
    // if "DONE" button is pressed, update project in database

    // first check that all required fields are filled in
    if (edit) {
      // this means that DONE button was pressed
      if (
        !projectState.name ||
        !projectState.pattern ||
        !projectState.description ||
        typeValues.length === 0
      ) {
        Alert.alert("Please fill in all required fields");
        // keep the edit button as "DONE" if there are unfilled required fields
        setEdit(true);
      }

      try {
        // update type array in the projectState to reflect changes made in DropDownPicker
        setProjectState({
          ...projectState,
          type: typeValues,
          tools: toolsValues,
          materials: materialsValues,
        });

        const projectRef = doc(collection(db, "projects"), projectState.id);
        const newLastUpdatedDate = getCurrentDate();

        updateDoc(projectRef, {
          name: projectState.name,
          type: typeValues,
          tools: toolsValues,
          materials: materialsValues,
          pattern: projectState.pattern,
          description: projectState.description,
          image: projectState.image,
          lastUpdated: newLastUpdatedDate,
        });
      } catch (error) {
        console.error("Error updating project: ", error);
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

  return (
    <KeyboardAvoidingView
      // behavior prop should be position
      behavior={Platform.OS === "ios" ? "position" : "height"}
      keyboardVerticalOffset={-6}
    >
      <ScrollView>
        <View style={styles.project}>
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
                // If project is not posted, show "DRAFT" text
                <Text style={styles.postStatusText}>DRAFT</Text>
              )}
            </View>
            <View style={styles.projectStatusAndPostStatus}>
              <View style={styles.projectInfo}>
                <View>
                  {/* if edit state is true, show input text. If not true, show the name as Text*/}
                  {edit ? (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 5,
                        }}
                      >
                        <Text style={styles.projectInfoText}>Name</Text>
                        <Text style={styles.requiredAsterisk}>*</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        returnKeyType="done"
                        onChangeText={(text) =>
                          setProjectState({ ...projectState, name: text })
                        }
                        value={projectState.name}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 5,
                      }}
                    >
                      <Text style={styles.projectInfoText}>Name: </Text>
                      <Text style={styles.projectNameAndPatternText}>
                        {projectState.name}
                      </Text>
                    </View>
                  )}
                </View>

                <View>
                  {/* if edit state is true, show drop down picker. If not true, show the types as Text*/}
                  {edit ? (
                    <View
                      style={[
                        styles.rowWithWrappersEdit,
                        typeDropDownIsOpen && { alignItems: "flex-start" },
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 5,
                        }}
                      >
                        <Text style={styles.projectInfoText}>Type</Text>
                        <Text style={styles.requiredAsterisk}>*</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          height: typeDropDownIsOpen ? 180 : 50,
                        }}
                      >
                        <DropDownPicker
                          open={typeDropDownIsOpen}
                          value={typeValues}
                          items={typeItems}
                          placeholder={"Select a type"}
                          setOpen={setTypeDropDownIsOpen}
                          setValue={setTypeValues}
                          setItems={setTypeItems}
                          multiple={true}
                          mode="BADGE"
                          showBadgeDot={false}
                          maxHeight={130}
                          style={styles.dropDownPicker}
                          listMode="SCROLLVIEW"
                          listItemContainerStyle={{ height: 30 }}
                          dropDownContainerStyle={{
                            borderColor: "#ccc",
                            backgroundColor: "#F5F5F5",
                          }}
                        />
                      </View>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.rowWithWrappersNotEdit,
                        typeDropDownIsOpen && { alignItems: "flex-start" },
                      ]}
                    >
                      <Text style={styles.projectInfoText}>Type: </Text>

                      <View style={styles.wrappers}>
                        {projectState.type.map((type) => (
                          <View style={styles.wrapper}>
                            <Text style={styles.wrapperText}>{type}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                <View>
                  {/* if edit state is true, show drop down picker. If not true, show the types as Text*/}
                  {edit ? (
                    <View
                      style={[
                        styles.rowWithWrappersEdit,
                        typeDropDownIsOpen && { alignItems: "flex-start" },
                      ]}
                    >
                      <Text style={styles.projectInfoText}>Tools</Text>
                      <View
                        style={{
                          flex: 1,
                          height: toolsDropDownIsOpen ? 140 : 50,
                        }}
                      >
                        <DropDownPicker
                          open={toolsDropDownIsOpen}
                          value={toolsValues}
                          items={toolsItems}
                          placeholder={"Select a tool"}
                          setOpen={setToolsDropDownIsOpen}
                          setValue={setToolsValues}
                          setItems={setToolsItems}
                          multiple={true}
                          listMode="SCROLLVIEW"
                          mode="BADGE"
                          showBadgeDot={false}
                          maxHeight={100}
                          style={styles.dropDownPicker}
                          listItemContainerStyle={{ height: 30 }}
                          ListEmptyComponent={() => (
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate("Add Inventory");
                              }}
                            >
                              <Text
                                style={{
                                  padding: 10,
                                  paddingLeft: 20,
                                  paddingRight: 20,
                                  textAlign: "center",
                                  fontStyle: "italic",
                                }}
                              >
                                Add a tool to inventory
                              </Text>
                            </TouchableOpacity>
                          )}
                          dropDownContainerStyle={{
                            borderColor: "#ccc",
                            backgroundColor: "#F5F5F5",
                          }}
                        />
                      </View>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.rowWithWrappersNotEdit,
                        typeDropDownIsOpen && { alignItems: "flex-start" },
                      ]}
                    >
                      <Text style={styles.projectInfoText}>Tools: </Text>
                      <View style={styles.wrappers}>
                        {projectState.tools.map((tool) => (
                          <View style={styles.wrapper}>
                            <Text style={styles.wrapperText}>{tool}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                <View>
                  {/* if edit state is true, show drop down picker. If not true, show the types as Text*/}
                  {edit ? (
                    <View
                      style={[
                        styles.rowWithWrappersEdit,
                        materialsDropDownIsOpen && { alignItems: "flex-start" },
                      ]}
                    >
                      <View
                        style={{
                          flex: 1,
                          height: materialsDropDownIsOpen ? 140 : 50,
                        }}
                      >
                        <Text style={styles.projectInfoText}>Materials</Text>
                        <DropDownPicker
                          open={materialsDropDownIsOpen}
                          value={materialsValues}
                          items={materialsItems}
                          placeholder={"Select a material"}
                          setOpen={setMaterialsDropDownIsOpen}
                          setValue={setMaterialsValues}
                          setItems={setMaterialsItems}
                          multiple={true}
                          showBadgeDot={false}
                          maxHeight={100}
                          listMode="SCROLLVIEW"
                          mode="BADGE"
                          listItemContainerStyle={{ height: 30 }}
                          style={styles.dropDownPicker}
                          ListEmptyComponent={() => (
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate("Add Inventory");
                              }}
                            >
                              <Text
                                style={{
                                  padding: 10,
                                  paddingLeft: 20,
                                  paddingRight: 20,
                                  textAlign: "center",
                                  fontStyle: "italic",
                                }}
                              >
                                Add a material to inventory
                              </Text>
                            </TouchableOpacity>
                          )}
                          dropDownContainerStyle={{
                            borderColor: "#ccc",
                            backgroundColor: "#F5F5F5",
                          }}
                        />
                      </View>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.rowWithWrappersNotEdit,
                        materialsDropDownIsOpen && { alignItems: "flex-start" },
                      ]}
                    >
                      <Text style={styles.projectInfoText}>Materials: </Text>
                      <View style={styles.wrappers}>
                        {projectState.materials.map((material) => (
                          <View style={styles.wrapper}>
                            <Text style={styles.wrapperText}>{material}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  {/* if edit state is true, show input text. If not true, show the name as Text*/}
                  {edit ? (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 20,
                        }}
                      >
                        <Text style={styles.projectInfoText}>Pattern</Text>
                        <Text style={styles.requiredAsterisk}>*</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        returnKeyType="done"
                        onChangeText={(text) =>
                          setProjectState({ ...projectState, pattern: text })
                        }
                        value={projectState.pattern}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.projectInfoText}>Pattern: </Text>
                      <Text style={styles.projectNameAndPatternText}>
                        {projectState.pattern}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{ marginTop: 10 }}>
                  {edit ? (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.projectInfoText}>Description</Text>
                        <Text style={styles.requiredAsterisk}>*</Text>
                      </View>
                      <View style={styles.projectDescriptionContainer}>
                        <TextInput
                          style={styles.description}
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
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.projectInfoText}>Description: </Text>

                      <Text style={styles.projectDescriptionText}>
                        {projectState.description}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Only show buttons if the project belongs to current signed in user and if edit mode is on */}
        {showButtons && (
          <View style={styles.buttons}>
            <TouchableOpacity
              title="Delete Project"
              style={styles.deleteButton}
              onPress={handleDeleteProject}
            >
              <Text style={styles.buttonText}>Delete Project</Text>
            </TouchableOpacity>
            <TouchableOpacity
              title={projectState.posted ? "Unpost Project" : "Post Project"}
              style={styles.postButton}
              onPress={postOrUnpostProject}
            >
              {projectState.posted ? (
                <>
                  <Text style={styles.buttonText}>Unpost Project</Text>
                </>
              ) : (
                <>
                  <Text style={styles.buttonText}>Post Project</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "center",
  },

  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    // marginBottom: 10,
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
    width: 150,
    height: 150,
    borderRadius: 10,
  },

  projectStatusAndPostStatus: {
    flexDirection: "column",
  },

  postStatus: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
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

  rowWithWrappersNotEdit: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },

  rowWithWrappersEdit: {
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
    fontSize: 15,
  },

  projectDescriptionText: {
    marginTop: 5,
    fontSize: 16,
  },

  description: {
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
    marginBottom: 50,
  },

  requiredAsterisk: {
    color: "red",
    fontSize: 20,
    marginRight: 5,
  },

  dropDownPicker: {
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#F5F5F5",
  },
  deleteButton: {
    backgroundColor: "#FE5B5B",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  postButton: {
    backgroundColor: "#0FDB53",
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
