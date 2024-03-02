import { Box, Pressable, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const categories = ["Countries", "Courses", "Authors", "Year",]

const CategoryItem = ({ item, index, navigation }) => (
    <Box key={index + Math.random()} alignItems="center">
        <Pressable onPress={() => {
            navigation?.navigate('Search');
        }}>
            {({
                isHovered,
                isPressed
            }) => {
                return <Box bg={isPressed ? "coolGray.200" : isHovered ? "coolGray.200" : "coolGray.100"} style={{
                    transform: [{
                        scale: isPressed ? 0.96 : 1
                    }],
                    minWidth: '100%',
                    minHeight: 70,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: 0,
                    flexDirection: 'row'
                }} p="5" rounded="8" shadow={3} borderWidth="1" borderColor="coolGray.300">
                    <Text color="coolGray.800" mt="3" fontWeight="medium" >
                        {item}
                    </Text>
                    <FontAwesome6 name='computer' />
                </Box>
            }}
        </Pressable>
    </Box>
)
const CategoryView = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.column}>
                {categories.slice(0, Math.ceil(categories.length / 2)).map((item, index) => (
                    <CategoryItem navigation={navigation} item={item} index={index} />
                ))}
            </View>
            <View style={styles.column}>
                {categories.slice(Math.ceil(categories.length / 2)).map((item, index) => (
                    <CategoryItem navigation={navigation} item={item} index={index * 2} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
        marginHorizontal: 2
    },
});

export default CategoryView;
