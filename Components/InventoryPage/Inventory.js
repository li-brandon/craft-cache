import { StyleSheet, Image, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const Inventory = ({ inventoryItem, navigation }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Inventory Detail", {
            inventoryItem: inventoryItem,
          });
        }}
      >
        <View style={styles.inventoryItem}>
          <View>
            <View style={styles.inventoryItemName}>
              <Text style={styles.inventoryItemNameText}>
                {inventoryItem.name}
              </Text>
            </View>
            <View style={styles.inventoryItemInfoAndImage}>
              <View style={styles.inventoryItemInfo}>
                <Text style={styles.inventoryItemInfoText}>
                  Brand: {inventoryItem.brand}
                </Text>
                <Text style={styles.inventoryItemInfoText}>
                  Size: {inventoryItem.size}
                </Text>
                <Text style={styles.inventoryItemInfoText}>
                  {/* Goes through array of tools and outputs them in a readable way */}
                  Categories:{" "}
                  {inventoryItem.category.map((cat, index) => {
                    if (index === inventoryItem.category.length - 1) {
                      return cat;
                    } else {
                      return cat + ", ";
                    }
                  })}
                </Text>
                <Text style={styles.inventoryItemInfoTextGrayed}>
                  Updated: {inventoryItem.lastUpdated}
                </Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: inventoryItem.image }}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  inventoryItem: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 5,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },

  inventoryItemName: {
    marginBottom: 5,
  },

  inventoryItemNameText: {
    fontSize: 17,
  },

  inventoryItemInfoAndImage: {
    flexDirection: "row",
    marginBottom: 5,
  },

  inventoryItemInfo: {
    width: "70%",
  },

  inventoryItemInfoText: {
    fontSize: 13,
  },

  inventoryItemInfoTextGrayed: {
    fontSize: 11,
    color: "grey",
  },

  imageContainer: {
    width: "30%",
    alignItems: "center",
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },

  inventoryItemStatusAndPostStatus: {
    flexDirection: "row",
  },

  inventoryItemStatus: {
    width: "60%",
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
