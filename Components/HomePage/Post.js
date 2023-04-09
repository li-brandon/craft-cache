import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  Animated,
  Easing,
} from "react-native";
import React from "react";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import userIcon from "../assets/user-icon.png";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../../firebase";

import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Post({ project: initialProject, navigation }) {
  const [project, setProject] = React.useState(initialProject);
  const [saved, setSaved] = React.useState(initialProject.saved);
  const [tapCount, setTapCount] = React.useState(0);
  const [animationValue, setAnimationValue] = React.useState(
    new Animated.Value(0)
  );

  React.useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // get the savedProjects of the current user and check if the current project is in the array
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        getDoc(userDocRef).then((doc) => {
          if (doc.exists()) {
            const savedProjects = doc.data().savedProjects;
            if (savedProjects.includes(project.id)) {
              setSaved(true);
            } else {
              setSaved(false);
            }
          }
        });
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);
    


  const viewUserProfile = async function () {
    const docRef = doc(db, "users", project.userID);
    try {
      const docSnap = await getDoc(docRef);
      navigation.navigate("Profile", {
        profileInfo: docSnap.data(),
        profileID: docSnap.id,
        visitingOwnProfile: auth.currentUser.uid === project.userID,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDoubleTap = () => {
    setTapCount(tapCount + 1);
    setTimeout(() => setTapCount(0), 500); // reset tap count after 500ms

    if (tapCount === 1) {
      handleHeartClicked();
    }
  };

  const handleHeartClicked = async function () {
    // first check if user is logged in
    if (!auth.currentUser) {
      return;
    }

    // check if user has already liked the project
    const user = auth.currentUser.uid;
    let updatedProject = { ...project };
    if (project.usersThatLiked.includes(user)) {
      // if so, remove the user from the array of users who liked the project
      const index = project.usersThatLiked.indexOf(user);
      updatedProject.usersThatLiked.splice(index, 1);
      updatedProject.numLikes--;
    } else {
      // if not, add the user to the array of users who liked the project
      updatedProject.usersThatLiked.push(user);
      updatedProject.numLikes++;
      animateHeart();
    }

    // update the project in the database
    const projectRef = doc(db, "projects", project.id);
    try {
      await updateDoc(projectRef, updatedProject);
      setProject(updatedProject);
    } catch (error) {
      console.log(error);
    }
  };

  const animateHeart = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 600,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start(() => {
      animationValue.setValue(0);
    });
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        url: project.image,
        message: `Check out this project I found on Craft Cache!`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleSaveProject = async () => {
    // first check if user is logged in
    if (!auth.currentUser) {
      return;
    }

    // check if user has already saved the project
    const user = auth.currentUser.uid;

    // each user has a savedProjects array in their document, which contains id of projects they have saved
    const userRef = doc(db, "users", user);
    try {
      const userDoc = await getDoc(userRef);
      const savedProjects = userDoc.data().savedProjects;

      // first take care of case user unsaves a project
      if (savedProjects.includes(project.id)) {
        // if so, remove the project from the array of saved projects 
        const index = savedProjects.indexOf(project.id);
        savedProjects.splice(index, 1);
      } else { // then take care of case user saves a project
        savedProjects.push(project.id);
      }

      setSaved(!saved); // update the saved state
      // update the user's document in the database
      await updateDoc(userRef, { savedProjects });
    }
    catch (error) {
      console.log(error);
    }

  };

  return (
    <View style={styles.projectPost}>
      <View style={styles.userOfPostAndOptionsButton}>
        <View style={styles.userOfPost}>
          <View>
            <TouchableOpacity onPress={viewUserProfile.bind(this, "Profile")}>
              <Image
                source={
                  project.userImage ? { uri: project.userImage } : userIcon
                }
                style={styles.userImage}
                alt="User Icon"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={viewUserProfile.bind(this, "Profile")}>
            <Text style={styles.userName}>{project.username}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.projectImageContainer}
        onPress={handleDoubleTap}
        activeOpacity={1}
      >
        <Image
          source={{ uri: project.image }}
          style={styles.projectImage}
          alt="Project Image"
          onPress={handleDoubleTap}
        />
        <Animated.View
          style={[
            styles.heartAnimation,
            {
              opacity: animationValue,
              transform: [
                {
                  scale: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1.5],
                  }),
                },
              ],
            },
          ]}
        >
          <FontAwesome name="heart" size={50} color="red" />
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.postInteractionIcons}>
        <View style={styles.likeCommentShareIcons}>
          {/* render the TouchableOpacity if user is logged in */}
          {auth.currentUser && (
            <TouchableOpacity onPress={handleHeartClicked.bind(this)}>
              <FontAwesome
                name={
                  project.usersThatLiked.includes(auth.currentUser.uid)
                    ? "heart"
                    : "heart-o"
                }
                style={styles.interactionIcon}
              />
            </TouchableOpacity>
          )}

          <FontAwesome name="comment-o" style={styles.interactionIcon} />
          <FontAwesome
            name="share-alt"
            style={styles.interactionIcon}
            onPress={handleShare}
          />
        </View>
        <View>
          <TouchableOpacity onPress={handleSaveProject}>
            <FontAwesome
              name={saved ? "bookmark" : "bookmark-o"}
              style={styles.interactionIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.projectLikesContainer}>
        <Text style={styles.projectLikesText}>{project.numLikes} likes</Text>
      </View>
      <View>
        <View style={styles.projectNameContainer}>
          <Text style={styles.projectNameText}>{project.name}</Text>
        </View>
        <View style={styles.projectInfoContainer}>
          <Text style={styles.projectInfoText}>
            Type:{" "}
            {project.type.map((type, index) => {
              if (index === project.type.length - 1) {
                return type;
              } else {
                return type + ", ";
              }
            })}
          </Text>
          <Text style={styles.projectInfoText}>
            Tool(s):{" "}
            {project.tools.map((tool, index) => {
              if (index === project.tools.length - 1) {
                return tool;
              } else {
                return tool + ", ";
              }
            })}
          </Text>
          <Text style={styles.projectInfoText}>
            Materials:{" "}
            {project.materials.map((material, index) => {
              if (index === project.materials.length - 1) {
                return material;
              } else {
                return material + ", ";
              }
            })}
          </Text>
          <Text style={styles.projectInfoText}>Pattern: {project.pattern}</Text>
          <Text style={styles.projectInfoText}>
            Description: {project.description}
          </Text>
        </View>
        <View style={styles.projectStatusContainer}>
          <Text style={styles.projectStatusText}>
            Started: {project.startDate}
          </Text>
          <Text style={styles.projectStatusText}>
            Last Updated: {project.lastUpdated}
          </Text>
          <Text style={styles.projectStatusText}>
            Status: {project.inProgress ? "In progress" : "Finished"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  projectPost: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dbdbdb",
  },
  userOfPostAndOptionsButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userOfPost: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    overflow: "hidden",
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  projectImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "white",
  },

  projectImage: {
    width: "100%",
    height: 275,
  },
  postInteractions: {
    padding: 5,
  },
  postInteractionIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 17,
  },
  likeCommentShareIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  interactionIcon: {
    marginRight: 16,
    fontSize: 27,
  },
  saveIcon: {
    fontSize: 27,
  },

  projectLikesContainer: {
    marginBottom: 10,
  },

  projectNameContainer: {
    marginBottom: 16,
  },

  projectNameText: {
    fontSize: 17,
    fontWeight: "bold",
  },

  projectInfo: {
    flexDirection: "row",
    marginBottom: 5,
  },

  projectInfoContainer: {
    marginBottom: 8,
  },

  projectInfoText: {
    fontSize: 15,
  },

  imageContainer: {
    width: "40%",
    alignItems: "center",
  },

  image: {
    width: 130,
    height: 140,
    borderRadius: 10,
  },

  projectStatus: {
    width: "60%",
  },
  postStatus: {
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
  },

  projectStatusText: {
    fontSize: 14,
    color: "grey",
  },

  projectLikesText: {
    fontSize: 15,
  },

  heartAnimation: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});
