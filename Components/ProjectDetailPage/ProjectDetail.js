import { StyleSheet, Text, View, Image, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, doc, updateDoc } from "firebase/firestore";

const ProjectDetail = ({ project }) => {
  const [projectState, setProjectState] = useState(project);
  const [showPostButton, setShowPostButton] = useState(false);

  useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) { 
        // if the current user is the owner of the project, show the post button
        if (user.uid === projectState.userID) {
          setShowPostButton(true);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

  return (
    <View>
      <View style={styles.project}>
        <View>
          <View style={styles.projectName}>
            <Text style={styles.projectNameText}>{projectState.name}</Text>
          </View>
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
              <View style={styles.projectStatus}>
                <Text style={styles.projectStatusText}>
                  Started: {projectState.startDate}
                </Text>
                <Text style={styles.projectStatusText}>
                  Last Updated: {projectState.lastUpdated}
                </Text>
                <Text style={styles.projectStatusText}>
                  Status: {projectState.inProgress ? "In progress" : "Finished"}
                </Text>
              </View>
              <View style={styles.projectInfo}>
                <Text style={styles.projectInfoText}>
                  Project Type: {projectState.type}
                </Text>
                <Text style={styles.projectInfoText}>
                  Tools: {projectState.tools}
                </Text>
                <Text style={styles.projectInfoText}>
                  Materials: {projectState.materials}
                </Text>
                <Text style={styles.projectInfoText}>
                  Pattern: {projectState.pattern}
                </Text>
                <Text style={styles.projectInfoText}>
                  Description: {projectState.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Only show button to POST or UNPOST if the project belongs to current signed in user */}
      {showPostButton && (
        <Button
          title={projectState.posted ? "Unpost" : "Post"}
          onPress={postOrUnpostProject}
        />
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

  projectName: {
    marginBottom: 5,
    alignItems: "center",
  },

  projectNameText: {
    fontSize: 20,
  },

  projectInfoAndImage: {
    flexDirection: "column",
    marginBottom: 5,
  },

  projectInfo: {
    width: "100%",
  },

  projectInfoText: {
    fontSize: 13,
  },

  imageContainer: {
    width: "100%",
    alignItems: "center",
  },

  image: {
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
});
