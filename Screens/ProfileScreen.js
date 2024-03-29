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

// import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { auth, db, resetByEmail } from "../firebase";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";
import { LoginContext } from "../Contexts/LoginContext";
import userIcon from "../Components/assets/user-icon.png";

const ProfileScreen = ({ navigation, route }) => {
  const { profileInfo, profileID, visitingOwnProfile, currentUserID } =
    route.params;

  const { projects, setProjects } = React.useContext(MyContext);
  const { loggedIn, setloggedIn } = React.useContext(LoginContext);
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const userEmail = user ? user.email : null;

  const [username, setUsername] = useState("");
  const [numFollowers, setNumFollowers] = useState("");
  const [numFollowing, setNumFollowing] = useState("");
  const [numPosts, setNumPosts] = useState("");
  const [publishedProjects, setPublishedProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState("");
  const [userBio, setUserBio] = useState("");
  const [image, setImage] = useState(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [profileFollowers, setProfileFollowers] = useState([]);

  useEffect(() => {
    // Set passed in profile info
    setUsername(profileInfo.username);
    setNumFollowers(profileInfo.followers.length);
    setNumFollowing(profileInfo.following.length);
    setSavedProjects(profileInfo.savedProjects);
    setUserBio(profileInfo.bio);
    setImage(profileInfo.image);

    // Get current user info
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setUserID(user.uid);

      const profileFollowersId = profileInfo.followers.map((info) => info.id);
      setProfileFollowers(profileFollowersId);

      if (profileFollowersId.includes(user.uid)) {
        setIsFollowing(true);
        console.log("User is following this profile");
      } else {
        setIsFollowing(false);
        console.log("User is not following this profile");
      }

      // profileID is the ID of the profile when we click on a user's profile from a Post
      if (profileID) {
        // get all projects published by the profile user
        const q = query(
          collection(db, "projects"),
          where("userID", "==", profileID),
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
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleFollow = async (userId) => {
    let updatedProfileFollowers;
    const userDoc = doc(db, "users", userId);
    const profileDocRef = doc(db, "users", profileID);

    try {
      if (profileFollowers.includes(userId)) {
        updatedProfileFollowers = profileFollowers.filter(
          (profiles) => profiles !== userId
        );

        // Remove profile from the current user's following
        await updateDoc(userDoc, {
          following: arrayRemove(doc(db, "users", profileID)),
        });

        // Remove current user reference from the profile's followers list
        await updateDoc(profileDocRef, {
          followers: arrayRemove(doc(db, "users", userId)),
        });

        setIsFollowing(false);
      } else {
        updatedProfileFollowers = profileFollowers.concat(userId);
        // Add profile to the current user's following
        await updateDoc(userDoc, {
          following: arrayUnion(doc(db, "users", profileID)),
        });

        // Add current user reference to the profile's followers list
        await updateDoc(profileDocRef, {
          followers: arrayUnion(doc(db, "users", userId)),
        });
        setIsFollowing(true);
      }
      setProfileFollowers(updatedProfileFollowers);
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  useEffect(() => {
    const updateFollowerCount = async () => {
      // Update the number of followers for the profile
      const profileDocRef = doc(db, "users", profileID);
      const profileDocSnap = await getDoc(profileDocRef);
      const profileDocData = profileDocSnap.data();
      const profileNumFollowers = profileDocData.followers.length;
      setNumFollowers(profileNumFollowers);
    };

    updateFollowerCount().catch(console.error);
  }, [profileFollowers]);

  const ChatListHandler = function () {
    // going to the
    navigation.navigate("Chat Detail", {
      userSend: user.uid,
      userReceive: profileID,
    });
  };

  return (
    <View style={styles.container}>
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

        <View style={styles.buttons}>
          {!visitingOwnProfile ? (
            <>
              <TouchableOpacity
                style={styles.followButton}
                onPress={toggleFollow.bind(this, userID)}
              >
                {isFollowing ? (
                  <>
                    <Text style={styles.followButtonText}>Unfollow</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.followButtonText}>Follow</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={ChatListHandler}
              >
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </>
          ) : (
            <></>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {publishedProjects.map((project, index) => (
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
    marginTop: 40,
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
});

export default ProfileScreen;
