import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import React, {
  useState,
  useEffect,
  createContext,
  Button,
  useContext,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import Inventory from "../Components/InventoryPage/Inventory";
import { MyContext } from "../Contexts/MyContext";
import { auth, db } from "../firebase";

import { collection, getDocs, query, where } from "firebase/firestore";
import AddInventoryScreen from "./AddInventoryScreen";

function InventoryPageScreen({ navigation }) {
  const { inventory, setInventory } = useContext(MyContext);
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

  // useFocusEffect is similar to useEffect, but it is called when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser) {
        const userID = currentUser.uid;
        const tempInventory = [];

        const q = query(
          collection(db, "inventory"),
          where("userID", "==", userID)
        );
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            tempInventory.push({ ...doc.data(), id: doc.id });
          });
          setInventory(tempInventory);
        });
      } else {
        setInventory([]); // clear inventory since there is no user
      }
    }, [currentUser])
  );

  return (
    // TODO: Change ScrollView to FlatList
    <View style={outerStyles.container}>
      <TouchableOpacity
        style={outerStyles.button}
        onPress={() => {
          navigation.navigate("Add Inventory");
        }}
      >
        <Text style={outerStyles.buttonText}>Add Inventory</Text>
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        {/* map over inventory and render Inventory component */}
        {inventory.map((inventoryItem, index) => (
          <Inventory
            key={index}
            inventoryItem={inventoryItem}
            navigation={navigation}
          />
        ))}
      </ScrollView>
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

const outerStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: "#0FDB53",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default InventoryPageScreen;
