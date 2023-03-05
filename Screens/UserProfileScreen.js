import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  ScrollView,
  FlatList,
} from "react-native";

import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth, db, resetByEmail } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { MyContext } from "../Contexts/MyContext";
import { LoginContext } from "../Contexts/LoginContext";

import Project from "../Components/ProjectsPage/Project";
import LoginScreen from "./LoginScreen";

import hat from "../Components/assets/flower-bucket-hat.jpg";

const UserProfileScreen = ({ navigation, route }) => {
  const { projects, setProjects } = React.useContext(MyContext);
  const { loggedIn, setLoggedIn } = React.useContext(LoginContext);
  const user = auth.currentUser;
  const userEmail = user ? user.email : null;

  const [username, setUsername] = useState("");
  const [numFollowers, setNumFollowers] = useState("");
  const [numFollowing, setNumFollowing] = useState("");
  const [numPosts, setNumPosts] = useState("");
  const [publishedProjects, setPublishedProjects] = useState("");
  const [savedProjects, setSavedProjects] = useState("");
  const [bio, setBio] = useState("");

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

  // TODO: Have props passed from RegisterSceen.js instead of making a call
  useEffect(async () => {
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUsername(docSnap.data().username);
      setNumFollowers(docSnap.data().numFollowers);
      setNumFollowing(docSnap.data().numFollowing);
      setPublishedProjects(docSnap.data().publishedProjects);
      setSavedProjects(docSnap.data().savedProjects);
      setBio(docSnap.data().bio);
    } else {
      console.log("No such document!");
    }

    if (!loggedIn) {
      navigation.navigate("Login");
    }
  }, []);

  const SignOutHandler = function (page) {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
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

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={SignOutHandler.bind(this, "Front Page")}
            style={styles.followButton}
          >
            <Text style={styles.editProfileButtonText}>Sign out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ResetPasswordHandler.bind(this, userEmail)}
            style={styles.followButton}
          >
            <Text style={styles.editProfileButtonText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Edit Profile")}
            style={styles.followButton}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Image style={styles.profileImage} source={hat} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.bio}>Craft Cache Member</Text>

        <View style={styles.stats}>
          <Text style={styles.stat}>{numPosts} Posts</Text>
          <Text style={styles.stat}>{numFollowers} Followers</Text>
          <Text style={styles.stat}>{numFollowing} Following</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {projects.map((project, index) => (
          <Project key={index} project={project} navigation={navigation} />
        ))}
      </ScrollView>
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
    marginBottom: 20,
    marginTop: 80,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 20,
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
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
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
});

export default UserProfileScreen;
