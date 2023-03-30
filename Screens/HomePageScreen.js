import { ScrollView, View, Text, StyleSheet, Image, RefreshControl } from "react-native";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
      setRefresh(true);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
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
            tempProjects = sortProjectsByStartDate(tempProjects);
            setProjects(tempProjects);
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
      setIsRefreshing(false);
    }, [isRefreshing])
  );

  function sortProjectsByStartDate(projects) {
    const sortedProjects = projects.sort((a, b) => {
      const startDateA = new Date(a.startDate.split("/").reverse().join("-"));
      const startDateB = new Date(b.startDate.split("/").reverse().join("-"));
      return startDateB - startDateA;
    });
    return sortedProjects;
  }
  const onRefresh = () => {
    setIsRefreshing(true);
  };
  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      }>
      {projects.map((project, index) => (
        <Post key={index} project={project} navigation={navigation}/>
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
