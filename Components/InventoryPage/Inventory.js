import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
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
        <View style={styles.inventory}>
          <View>
            <View style={styles.inventoryName}>
              <Text>{inventoryItem.name}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  inventory: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 5,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },

  inventoryName: {
    marginBottom: 5,
  },
});
