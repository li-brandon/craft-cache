import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { MEALS, CATEGORIES } from "../Data/dummy-data.js";
import ItemGrids from "../Components/ExplorePage/ItemGrids.js";
import { GlobalStyles } from "../Constants/styles.js";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import { SearchBar } from "react-native-elements";

function ExplorePageScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [searchedProjects, setSearchedProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [refresh, setRefresh] = useState(false);

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
      const tempProjects = [];
      const q = query(collection(db, "projects"), where("posted", "==", true));

      // get all projects that are posted and add to tempProjects
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            tempProjects.push({ ...doc.data(), id: doc.id });
          });
          setProjects(tempProjects);
          setSearchedProjects(tempProjects); // this makes sure projects are shown right away
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }, [])
  );

  function renderItem({ item }) {
    function pressHandler() {
      // navigate to detail page with project
      navigation.navigate("Detail", {
        project: item,
        navigation: navigation,
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

  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch(search);

    handleSearchChange(search);
  };

  const handleSearchChange = (search) => {
    const filteredProjects = projects.filter((project) =>
      project.name.includes(search)
    );
    setSearchedProjects(filteredProjects);
  };

  return (
    <View>
      <SearchBar
        placeholder="Search by project name"
        onChangeText={updateSearch}
        value={search}
        containerStyle={{ backgroundColor: "#FEB85B" }} // Set container background color
        inputContainerStyle={{ backgroundColor: "white" }}
      />
      <FlatList
        data={searchedProjects}
        renderItem={renderItem}
        numColumns={2}
        style={styles.flatList}
      />
    </View>
  );
}
export default ExplorePageScreen;

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: "#FEB85B",
  },
});
