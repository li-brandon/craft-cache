import React from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
function CategoryGrids({ title, color, onPress }) {
  return (
    <View style={[styles.grid]}>
      <Pressable
        style={({ pressed }) => [
          { flex: 1 },
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={onPress}
      >
        <View style={[styles.gridInner, { backgroundColor: color }]}>
          <Text style={styles.title}>{title}</Text>
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
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
});
export default CategoryGrids;
