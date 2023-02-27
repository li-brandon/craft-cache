import { ScrollView, Text, StyleSheet, AsyncStorage } from "react-native";
import React, { useState, useEffect, createContext, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";
import { auth, db } from "../firebase";

import { collection, getDocs, query, where } from "firebase/firestore";

function ProjectsPageScreen({ navigation }) {
  const { projects, setProjects } = useContext(MyContext);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  // useFocusEffect is similar to useEffect, but it is called when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser) {
        const userID = currentUser.uid;
        const tempProjects = [];

        const q = query(collection(db, "projects"), where("userID", "==", userID));
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            tempProjects.push({ ...doc.data(), id: doc.id });
          });
          setProjects(tempProjects);
        });
      }
      else {
        setProjects([]); // clear projects since there is no user
      }
    }, [currentUser])
  );

  return (
    // TODO: Change ScrollView to FlatList
    <ScrollView style={styles.container}>
      {/* map over projects and render Project component */}
      {projects.map((project, index) => (
        <Project key={index} project={project} navigation={navigation} />
      ))}
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

export default ProjectsPageScreen;
