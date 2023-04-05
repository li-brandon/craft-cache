import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import Post from "../Components/HomePage/Post";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";

function HomePageScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    setLoading(true);
    let tempProjects = [];
    const q = query(collection(db, "projects"), where("posted", "==", true));
    // console.log("effect refresh")
    // get all projects that are posted and add to tempProjects
    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tempProjects.push({ ...doc.data(), id: doc.id });
        });

        // get the username of the user who posted each project
        const promises = tempProjects.map((project) => {
          const userDocRef = doc(db, "users", project.userID);
          return getDoc(userDocRef).then((doc) => {
            if (doc.exists()) {
              // add username and profile pic to project
              const username = doc.data().username;
              project.username = username;
              const profilePicRef = doc.data().image;
              project.userImage = profilePicRef;
            }
          });
        });

        // wait for all promises to resolve before updating state
        Promise.all(promises).then(() => {
          // filter and sort projects by start date and show the most recent first
          tempProjects = sortProjectsDescendingOrder(tempProjects);
          setProjects(tempProjects);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  function sortProjectsDescendingOrder(projects) {
    const sortedProjects = projects.sort((a, b) => {
      // each project has a timePosted field that is a timestamp
      // convert to milliseconds and compare
      return b.timePosted.toMillis() - a.timePosted.toMillis();
    });
    return sortedProjects;
  }
  

  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    try {
      fetchPosts();
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setRefresh(false);
    }

  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
    >
      {projects.map((project) => (
        <Post key={project.id} project={project} navigation={navigation} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 8,
    backgroundColor: "white",
  },
});

export default HomePageScreen;
