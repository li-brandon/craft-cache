import { StyleSheet, Text, View, Image, Button } from "react-native";
import React, { useState } from "react";

const InventoryDetail = ({ inventoryItem }) => {
  const [inventoryState, setInventoryState] = useState(inventoryItem);

  return (
    <View>
      <View style={styles.inventory}>
        <View>
          <View style={styles.inventoryName}>
            <Text style={styles.inventoryNameText}>{inventoryState.name}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InventoryDetail;

const styles = StyleSheet.create({
  inventory: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 5,
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
  },

  inventoryName: {
    marginBottom: 5,
    alignItems: "center",
  },

  inventoryNameText: {
    fontSize: 20,
  },

  inventoryInfoAndImage: {
    flexDirection: "column",
    marginBottom: 5,
  },

  inventoryInfo: {
    width: "100%",
  },

  inventoryInfoText: {
    fontSize: 13,
  },

  imageContainer: {
    width: "100%",
    alignItems: "center",
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },

  inventoryStatusAndPostStatus: {
    flexDirection: "column",
  },

  inventoryStatus: {
    width: "60%",
  },

  postStatus: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    width: "100%",
  },

  inventoryStatusText: {
    fontSize: 13,
    color: "grey",
  },

  postStatusText: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
