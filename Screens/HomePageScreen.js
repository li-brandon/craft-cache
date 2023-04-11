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
        const promises = tempProjects.map(async (project) => {
          const userDocRef = doc(db, "users", project.userID);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            // add username and profile pic to project
            const username = userDoc.data().username;
            project.username = username;
            const profilePicRef = userDoc.data().image;
            project.userImage = profilePicRef;
            // get savedProjects for current user and wait for it to resolve
            return new Promise((resolve, reject) => {
              if (!currentUser) {
                resolve();
                return;
              }
              const savedProjectsRef = doc(db, "users", currentUser.uid);
              getDoc(savedProjectsRef)
                .then((doc) => {
                  if (doc.exists()) {
                    // add savedProjects to project
                    const savedProjects = doc.data().savedProjects;
                    if (savedProjects) {
                      project.saved = savedProjects.includes(project.id);
                    }
                    resolve();
                  } else {
                    console.log("No such document!");
                  }
                })
                .catch((error) => {
                  console.log("Error getting document:", error);
                });
            });
          }
        });

        // wait for all promises to resolve before updating state
        Promise.all(promises).then(() => {
          setProjects([]); // clear projects before setting new ones
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
    // clear projects
    try {
      fetchPosts();
    } catch (error) {
      console.log(error);
    } finally {
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
