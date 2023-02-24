import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { MEALS, CATEGORIES } from "../Data/dummy-data.js";
import ItemGrids from "../Components/ExplorePage/ItemGrids.js";
import { GlobalStyles } from "../Constants/styles.js";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function ExplorePageScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
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

  useFocusEffect(
    React.useCallback(() => {
      if (currentUser) {
        const userID = currentUser.uid;
        // fetch all projects from database
        const tempProjects = [];
        // query database for projects that are posted and not projects of current user
        const q = query(
          collection(db, "projects"),
          where("userID", "!=", userID),
          where("posted", "==", true)
        );
        // handle promise as well
        getDocs(q)
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              tempProjects.push({ ...doc.data(), id: doc.id });
            });
            setProjects(tempProjects);
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      }
    }, [currentUser])
  );

  function renderItem({ item }) {
    function pressHandler() {
      // navigate to detail page
      navigation.navigate("Detail", {
        project: item,
      });
    }
    return (
      <ItemGrids
        imageUri={item.image}
        color={item.color}
        onPress={pressHandler}
      />
    );
  }
  return <FlatList data={projects} renderItem={renderItem} numColumns={2} />;
}
export default ExplorePageScreen;
