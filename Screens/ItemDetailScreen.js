import { View, Text } from "react-native";

function ItemDetailScreen({ navigation, route }) {
    const id = route.params['id'];
    return (
        <View>
            <Text>ItemId:{id}</Text>
            {/* <Text>ItemDetail</Text> */}
        </View>
    );
}

export default ItemDetailScreen;