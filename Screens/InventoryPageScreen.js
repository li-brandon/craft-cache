import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Animated,
} from "react-native";

import React, {
  useState,
  useEffect,
  createContext,
  Button,
  useContext,
  useRef,
} from "react";

import { useFocusEffect } from "@react-navigation/native";
import Inventory from "../Components/InventoryPage/Inventory";
import { MyContext } from "../Contexts/MyContext";
import { auth, db } from "../firebase";

import { collection, getDocs, query, where } from "firebase/firestore";
import AddInventoryScreen from "./AddInventoryScreen";

import { PanGestureHandler, State } from "react-native-gesture-handler";

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

  const panRef = useRef(new Animated.ValueXY()).current; // Animated value for pan gesture

  const onGestureEvent = (event) => {
    // Handle swipe logic here
    Animated.event([{ nativeEvent: { translationX: panRef.x } }], {
      useNativeDriver: false,
    })(event);
  };

  // Handler for handler state change event
  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      // Swipe has ended, determine if it's a swipe to delete or not
      if (event.nativeEvent.translationX < -50) {
        // Swipe to delete detected, animate the deletion section
        Animated.timing(panRef, {
          toValue: { x: -200, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          // Call a function to delete the item
          console.log("Swipe to delete detected");
          // Implement your own logic to delete the item here
        });
      } else {
        // Not a swipe to delete, reset the animated value
        Animated.spring(panRef, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    }
  };

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
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        {/* <Animated.ScrollView
          style={[styles.container, { transform: [{ translateX: panRef.x }] }]}
        >
          {inventory.map((inventoryItem, index) => (
            <Inventory
              key={index}
              inventoryItem={inventoryItem}
              navigation={navigation}
            />
          ))}
        </Animated.ScrollView> */}
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
      </PanGestureHandler>
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
  deleteSection: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  deleteText: {
    color: "white",
  },
});

export default InventoryPageScreen;
