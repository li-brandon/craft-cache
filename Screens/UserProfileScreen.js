import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  ScrollView,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import {
  getAuth,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db, resetByEmail } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";
import { LoginContext } from "../Contexts/LoginContext";
import userIcon from "../Components/assets/user-icon.png";
import { FontAwesome } from "@expo/vector-icons";

const UserProfileScreen = ({ navigation, route }) => {
  const { projects, setProjects } = React.useContext(MyContext);
  const { loggedIn, setloggedIn } = React.useContext(LoginContext);
  const [user, setUser] = useState(null);
  const userEmail = user ? user.email : null;

  const [username, setUsername] = useState("");
  const [numFollowers, setNumFollowers] = useState("");
  const [numFollowing, setNumFollowing] = useState("");
  const [numPosts, setNumPosts] = useState("");
  const [publishedProjects, setPublishedProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState("");
  const [userBio, setUserBio] = useState("");
  const [image, setImage] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef();
  useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // TODO: Have props passed from RegisterSceen.js instead of making a call
  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      const userEmail = user ? user.email : null;

      if (user !== null) {
        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        const userEmail = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        // console.log(userEmail);
        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        const uid = user.uid;
      }

      async function fetchData() {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setUsername(docSnap.data().username);
          setNumFollowers(docSnap.data().followers.length);
          setNumFollowing(docSnap.data().following.length);

          setSavedProjects(docSnap.data().savedProjects);
          setUserBio(docSnap.data().bio);
          setImage(docSnap.data().image);
          // publishedProjects isn't set up yet so we will just fetch all posts that are posted by current user
          const q = query(
            collection(db, "projects"),
            where("userID", "==", user.uid),
            where("posted", "==", true)
          );
          getDocs(q).then((querySnapshot) => {
            const tempProjects = [];
            querySnapshot.forEach((doc) => {
              tempProjects.push({ ...doc.data(), id: doc.id });
            });
            setPublishedProjects(tempProjects);
            setNumPosts(tempProjects.length);
          });
        } else {
          console.log("No such document!");
        }
      }

      fetchData(); // call the async function immediately

      return () => {
        // clean-up function
      };
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          onPress={() => {
            navigation.navigate("Chat List", { userId: auth.currentUser.uid });
          }}
        ></Ionicons>
      ),
    });
  }, [route.params]);

  const SignOutHandler = function (page) {
    // sign the user out and redirect to the login page
    signOut(auth).then(() => {
      setloggedIn(false);
      navigation.navigate(page);
    });
  };

  const ResetPasswordHandler = function (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        SignOutHandler("Login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // ..
      });
  };

  const handleOutsideClick = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome
          name="bars"
          size={24}
          color="black"
          style={styles.barsIcon}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <Image
        style={styles.profileImage}
        source={image ? { uri: image } : userIcon}
      />

      <View style={styles.userInfo}>
        <Text style={styles.username}>{username}</Text>

        <View style={styles.stats}>
          <Text style={styles.stat}>{numPosts} Posts</Text>
          <Text style={styles.stat}>{numFollowers} Followers</Text>
          <Text style={styles.stat}>{numFollowing} Following</Text>
        </View>

        <Text style={styles.bio}>
          {userBio == "" ? "Craft Cache Member" : userBio}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {publishedProjects.map((project, index) => (
          <Project key={index} project={project} navigation={navigation} />
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
          <View style={styles.modalContainer} ref={modalRef}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate("Edit Profile");
                }}
              >
                <Text style={styles.modalText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate("Saved Projects");
                }}
              >
                <Text style={styles.modalText}>Saved Projects</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  ResetPasswordHandler.bind(this, userEmail);
                }}
              >
                <Text style={styles.modalText}>Reset Password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  SignOutHandler("Login");
                }}
              >
                <Text style={styles.modalText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF",
  },
  iconContainer: {
    flexDirection: "row-reverse",
    width: "90%",
    marginTop: 10,
  },
  contentContainer: {
    padding: 15,
  },
  right: {
    marginLeft: "auto",
    // flexDirection: 'column'
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    marginTop: 20,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 0,
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 35,
  },
  stat: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  buttons: {
    flexDirection: "row",
  },
  followButton: {
    backgroundColor: "#3897f1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  messageButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  messageButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  editProfileButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editProfileButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: "#3897f1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default UserProfileScreen;
