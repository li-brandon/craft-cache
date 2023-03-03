import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Button,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore";

const ProjectDetail = ({ project, navigation }) => {
  const [projectState, setProjectState] = useState(project);
  const [showButtons, setshowButtons] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // if the current user is the owner of the project, show the post button
        if (user.uid === projectState.userID) {
          setshowButtons(true);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

  const handleEditButtonPress = () => {
    setEdit(!edit); // toggle edit button state

    // if "DONE" button is pressed, update project in database
    if (edit) {
      try {
        const projectRef = doc(collection(db, "projects"), projectState.id);
        updateDoc(projectRef, {
          name: projectState.name,
          type: projectState.type,
          tools: projectState.tools,
          materials: projectState.materials,
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
    <View>
      <View style={styles.project}>
        <View>
          {showButtons ? (
            <View style={styles.editBtnContainer}>
              <Button
                style={styles.editBtn}
                // title is "EDIT" if edit state is false, "DONE" if edit state is true
                title={edit ? "DONE" : "EDIT"}
                onPress={() => handleEditButtonPress()}
              />
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

                <View style={styles.rowWithWrappers}>
                  <Text style={styles.projectInfoText}>Type: </Text>
                  <View style={styles.wrappers}>
                    <View style={styles.wrapper}>
                      <Text style={styles.wrapperText}>
                        {projectState.type}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.rowWithWrappers}>
                  <Text style={styles.projectInfoText}>Tools: </Text>
                  <View style={styles.wrappers}>
                    {/* Tools is an array so iterate through it and create a new view for each */}
                    {projectState.tools.map((tool) => (
                      <View style={styles.wrapper}>
                        <Text style={styles.wrapperText}>{tool}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.rowWithWrappers}>
                  <Text style={styles.projectInfoText}>Materials: </Text>
                  <View style={styles.wrappers}>
                    {/* Tools is an array so iterate through it and create a new view for each */}
                    {projectState.materials.map((material) => (
                      <View style={styles.wrapper}>
                        <Text style={styles.wrapperText}>{material}</Text>
                      </View>
                    ))}
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
                    {edit ? (
                      <TextInput
                        style={styles.inputField}
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
                        onChangeText={(text) =>
                          setProjectState({
                            ...projectState,
                            description: text,
                          })
                        }
                        value={projectState.description}
                        editable
                        multiline
                        numberOfLines={4}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        blurOnSubmit={true} // prevent new line when return button is pressed
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
    </View>
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
    fontSize: 17,
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
    // the edit button should be on the right side of the screen
    // so we need to set the position to absolute
    position: "absolute",
    right: 0,
    backgroundColor: "#ECF3F9",
    width: "17%",
  },

  editBtn: {
    backgroundColor: "#ECF3F9",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 12,
    padding: 2,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 5,
    marginTop: 0,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
