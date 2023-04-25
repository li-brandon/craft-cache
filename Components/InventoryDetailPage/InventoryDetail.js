import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";

import { auth, db, storage } from "../../firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";

import { useNavigation } from "@react-navigation/native";

const InventoryDetail = ({ inventoryItem }) => {
  const [inventoryItemState, setInventoryItemState] = useState(inventoryItem);
  const [inventoryItemID, setInventoryItemID] = useState(inventoryItem.id);

  const navigation = useNavigation();

  const handleDeleteItem = async () => {
    // Prompt user to confirm deletion
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          // Delete item from database after user confirms deletion
          onPress: () => {
            try {
              const projectRef = doc(
                collection(db, "inventory"),
                inventoryItemID
              );
              deleteDoc(projectRef);
              navigation.goBack();
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.inventoryItem}>
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
              Categorie(s): {inventoryItemState.category}
            </Text>
            <Text style={styles.inventoryItemInfoText}>
              Count: {inventoryItemState.count}
            </Text>
            <Text style={styles.inventoryItemInfoText}>
              Description: {inventoryItemState.description}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.deleteItemButton}
          onPress={handleDeleteItem}
        >
          <Text style={styles.buttonText}>Delete Item</Text>
        </TouchableOpacity>
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
  buttons: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteItemButton: {
    backgroundColor: "#FE5B5B",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
