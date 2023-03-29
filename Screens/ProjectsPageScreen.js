import { ScrollView, StyleSheet, AsyncStorage } from "react-native";
import React, { useState, useEffect, createContext, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Project from "../Components/ProjectsPage/Project";
import { MyContext } from "../Contexts/MyContext";
import { auth, db } from "../firebase";
import { TouchableOpacity } from "react-native";
import { Component } from 'react';
import { View, TextField, Text, Button, Colors } from 'react-native';
import { collection, getDocs, query, where } from "firebase/firestore";
// import { Checkox } from '@react-native-community/checkbox;
function ProjectsPageScreen({ navigation }) {
  const { projects, setProjects } = useContext(MyContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [posted, setIsPosted] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(["Embroidery", "Crochet", "Knitting", "Sewing"]);

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

        const q = query(
          collection(db, "projects"),
          where("userID", "==", userID),
          where("posted", "==", posted),
          // where("type", "array-contains", "Embroidery"),
          where("type", "array-contains-any", categoryFilter),
        );

        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            tempProjects.push({ ...doc.data(), id: doc.id });
          });
          setProjects(tempProjects);
        });
      } else {
        setProjects([]); // clear projects since there is no user
      }
    }, [currentUser, posted, categoryFilter])
  );

  return (
    <View style={styles.container}>

      <Button label={'Press'}
        onPress={() => setIsPosted(!posted)}
        title="unposted" ></Button>
      <Button label={'Press'}
        onPress={() => setCategoryFilter(["Embroidery"])}
        title="Embroidery" ></Button>
      <Button label={'Press'}
        onPress={() => setCategoryFilter(["Sewing"])}
        title="Sewing" ></Button>
      <Button label={'Press'}
        onPress={() => setCategoryFilter(["Embroidery", "Crochet", "Knitting", "Sewing"])}
        title="All" ></Button>
      {/* <CheckBox value={!posted}
        onValueChange={() => setIsPosted(!posted)}
        label="unposted" /> */}

      <ScrollView style={styles.container}>
        {projects.map((project, index) => (
          <Project key={index} project={project} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
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
