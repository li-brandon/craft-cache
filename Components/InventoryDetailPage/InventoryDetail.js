import { StyleSheet, Text, View, Image, Button } from "react-native";
import React, { useState } from "react";

const InventoryDetail = ({ inventoryItem }) => {
  const [inventoryItemState, setInventoryItemState] = useState(inventoryItem);

  return (
    <View>
      <View style={styles.inventoryItem}>
        <View>
          <View style={styles.inventoryItemName}>
            <Text style={styles.inventoryItemNameText}>
              {inventoryItemState.name}
            </Text>
          </View>
          <View style={styles.inventoryItemInfoAndImage}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: inventoryItemState.image }}
              />
            </View>
            <View style={styles.postStatus}>
              <Text style={styles.inventoryItemStatusText}>
                Last Updated: {inventoryItemState.lastUpdated}
              </Text>
            </View>
            <View style={styles.inventoryItemStatusAndPostStatus}>
              <View style={styles.inventoryItemInfo}>
                <Text style={styles.inventoryItemInfoText}>
                  Brand: {inventoryItemState.brand}
                </Text>
                <Text style={styles.inventoryItemInfoText}>
                  Size: {inventoryItemState.size}
                </Text>
                <Text style={styles.inventoryItemInfoText}>
                  Categories: {inventoryItemState.category}
                </Text>
                <Text style={styles.inventoryItemInfoText}>
                  Description: {inventoryItemState.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InventoryDetail;

const styles = StyleSheet.create({
  inventoryItem: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 5,
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
  },

  inventoryItemName: {
    marginBottom: 5,
    alignItems: "center",
  },

  inventoryItemNameText: {
    fontSize: 20,
  },

  inventoryItemInfoAndImage: {
    flexDirection: "column",
    marginBottom: 5,
  },

  inventoryItemInfo: {
    width: "100%",
  },

  inventoryItemInfoText: {
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

  inventoryItemStatusAndPostStatus: {
    flexDirection: "column",
  },

  inventoryItemStatus: {
    width: "100%",
  },

  postStatus: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    width: "100%",
  },

  inventoryItemStatusText: {
    fontSize: 13,
    color: "grey",
  },

  postStatusText: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
