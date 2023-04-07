import { ScrollView, Text, StyleSheet } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";
import { auth, db } from "../firebase";

import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function SavedProjectsScreen({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [projectIDs, setProjectIDs] = useState([]); // array of project IDs
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      // go though projectIDs and get the project data
      if (user) {
        const projectsArray = []; // temporary array to hold project data
        const promises = projectIDs.map((projectID) => {
          const projectRef = doc(db, "projects", projectID);
          return getDoc(projectRef).then((doc) => {
            if (doc.exists()) {
              projectsArray.push(doc.data());
            }
          });
        });
        Promise.all(promises).then(() => {
          setProjects(projectsArray); // set projects state after all data has been fetched
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [projectIDs]);

  // useFocusEffect is similar to useEffect, but it is called when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser) {
        const userID = currentUser.uid;
        const userDocRef = doc(db, "users", userID);
        let savedProjectIDs = [];
        getDoc(userDocRef).then((doc) => {
          if (doc.exists()) {
            savedProjectIDs = doc.data().savedProjects; // array of project IDs
            setProjectIDs(savedProjectIDs);
          }
        });
      } else {
        setProjects([]); // clear projects since there is no user
      }
    }, [currentUser])
  );

  return (
    // TODO: Change ScrollView to FlatList
    <ScrollView style={styles.container}>
      {/* map over projects and render Project component */}
      {/* if projects is empty, show text saying There are no saved projects */}
      {projects.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          There are no saved projects
        </Text>
      ) : (
        projects.map((project, index) => (
          <Project key={index} project={project} navigation={navigation} />
        ))
      )}

      {/* {projects.map((project, index) => (
        <Project key={index} project={project} navigation={navigation} />
      ))} */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
  },
});

export default SavedProjectsScreen;
