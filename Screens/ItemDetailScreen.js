import { ScrollView, Text, StyleSheet, AsyncStorage, View } from "react-native";
import React, { useEffect, useState, createContext, useContext } from "react";
import ProjectDetail from "../Components/ProjectDetailPage/ProjectDetail";
import { MyContext } from "../Contexts/MyContext";

function ItemDetailScreen({ navigation, route }) {
  const { projects } = useContext(MyContext);
  const id = route.params["id"];
  const proj = findArrayElementById(projects, id);
  return (
    <View>
      <ProjectDetail project={proj} />
    </View>
  );
}

function findArrayElementById(array, id) {
  return array.find((element) => {
    return element.id === id;
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
  },
});

export default ItemDetailScreen;
