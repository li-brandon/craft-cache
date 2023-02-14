import { View, Text, FlatList } from "react-native";
import { MEALS, CATEGORIES } from "../Data/dummy-data.js";
import ItemGrids from "../Components/ExplorePage/ItemGrids.js";
import { GlobalStyles } from "../Constants/styles.js";
function ExplorePageScreen({ navigation }) {
    function renderItem(itemData) {
        function pressHandler() {
            // navigate
            navigation.navigate("Detail", {
                id: itemData.item.id,

            });
        }
        return (
            <ItemGrids
                title="item"
                color={GlobalStyles.colors.primary50}
                onPress={pressHandler}
            ></ItemGrids>
        );

    }
    return (
        <FlatList data={CATEGORIES}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
        />
    );
}
export default ExplorePageScreen;