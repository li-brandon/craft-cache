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

import { useFocusEffect } from "@react-navigation/native";

import {
  getAuth,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db, resetByEmail } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";
import { LoginContext } from "../Contexts/LoginContext";
import userIcon from "../Components/assets/user-icon.png";

const ProfileScreen = ({ navigation, route }) => {
  const { userInfo } = route.params;

  const { projects, setProjects } = React.useContext(MyContext);
  const { loggedIn, setloggedIn } = React.useContext(LoginContext);
  const [user, setUser] = useState(null);
  const userEmail = user ? user.email : null;

  const [username, setUsername] = useState("");
  const [numFollowers, setNumFollowers] = useState("");
  const [numFollowing, setNumFollowing] = useState("");
  const [numPosts, setNumPosts] = useState("");
  const [publishedProjects, setPublishedProjects] = useState("");
  const [savedProjects, setSavedProjects] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    setUsername(userInfo.username);
    setNumFollowers(userInfo.numFollowers);
    setNumFollowing(userInfo.numFollowing);
    setPublishedProjects(userInfo.publishedProjects);
    setSavedProjects(userInfo.savedProjects);
    setBio(userInfo.bio);
    setImage(userInfo.image);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={image ? { uri: image } : userIcon}
      />

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

export default ProfileScreen;
