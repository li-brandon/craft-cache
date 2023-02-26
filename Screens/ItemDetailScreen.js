import { ScrollView, Text, StyleSheet, AsyncStorage, View } from "react-native";
import React, { useEffect, useState, createContext, useContext } from "react";
import ProjectDetail from "../Components/ProjectDetailPage/ProjectDetail";
import { MyContext } from "../Contexts/MyContext";

function ItemDetailScreen({ route }) {

  const { project } = route.params;

  return (
    <View>
      <ProjectDetail project={project}/>
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

export default ItemDetailScreen;
