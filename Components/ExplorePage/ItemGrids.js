import React from "react";
import { StyleSheet, View, Pressable, Text, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
function CategoryGrids({ imageUri, color, onPress }) {
  return (
    <View style={[styles.grid]}>
      <Pressable
        style={({ pressed }) => [
          { flex: 1 },
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={onPress}
      >
        <View style={[styles.gridInner]}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  grid: {
    flex: 1,
    margin: 16,
    height: 150,
    borderRadius: 8,
    // backgroundColor: 'white',
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  gridInner: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.2,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
});
export default CategoryGrids;
