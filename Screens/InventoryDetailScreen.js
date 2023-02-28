import { ScrollView, Text, StyleSheet, AsyncStorage, View } from "react-native";
import React, { useEffect, useState, createContext, useContext } from "react";
import InventoryDetail from "../Components/InventoryDetailPage/InventoryDetail";
import { MyContext } from "../Contexts/MyContext";

function InventoryDetailScreen({ route }) {
  const { inventoryItem } = route.params;

  return (
    <View>
      <InventoryDetail inventoryItem={inventoryItem} />
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

export default InventoryDetailScreen;
