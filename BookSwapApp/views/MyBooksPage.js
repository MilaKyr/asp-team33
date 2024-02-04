import { Box, Button, FlatList, Flex, HStack, Heading, Image, Pressable, Text, VStack } from 'native-base';
import { StyleSheet, View } from 'react-native';


const myBooks = Array.from([1, 2], (index) => {
    return ({
        id: index,
        title: "The Web Application Hacker's Handbook: Finding and Exploiting Security Flaws",
        authors: ["Dafydd Stuttard", "Marcus Pinto"],
        description: "The highly successful security book returns with a new edition, completely updatedWeb applications are the front door to most organizations, exposing them to attacks that may disclose personal information, execute fraudulent transactions, or compromise ordinary users. This practical book has been completely updated and revised to discuss the latest step-by-step techniques for attacking and defending the range of ever-evolving web applications. You'll explore the various new technologies employed in web applications that have appeared since the first edition and review the new attack techniques that have been developed, particularly in relation to the client side",
        edition: "2nd",
        icbn_10: "1118026470",
        image: require('../assets/tim-alex-xG5VJW-7Bio-unsplash.jpg'),
        courses: ["Computer Security"],
        user: {
            id: '1',
            name: 'John',
            surname: 'Doe',
        },
    })
})

const MyBooksPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Flex direction='row'>
                <Button width='50%' size='lg' variant='outline' onPress={() => {
                    navigation.navigate('SwapRequest')
                }}>My Swap Request</Button>
                <Button size='lg' width='50%' variant='outline' onPress={() => console.log("hello world")}>Upload New Book</Button>
            </Flex>
            <Box>
                <Heading fontSize="xl" p="4" pb="3">
                    My Books
                </Heading>
                <FlatList data={myBooks} renderItem={({
                    item
                }) => <Box marginBottom={4} marginRight={1}>
                        <HStack justifyContent="space-between">
                            <Image rounded='lg' style={styles.imageCover} source={item.image} alt='image' />
                            <VStack justifyContent='space-between' pl={2} width='80%' minHeight={100}>
                                <Text color="coolGray.800" bold>
                                    {item.title}
                                </Text>
                                <Text fontSize="xs" _light={{
                                    color: "violet.500"
                                }} fontWeight="500">
                                    by {item.authors.join(", ")}.
                                </Text>
                                <Text fontSize="xs" color="coolGray.800" alignSelf="flex-start">
                                    Courses: {item.courses}
                                </Text>
                                <Button onPress={() => {
                                    navigation.navigate('SwapOffer')
                                }}>View Offers for this book</Button>
                                <HStack width='100%'>
                                    <Button width='50%' variant='outline' onPress={() => console.log("hello world")}>Update</Button>
                                    <Button colorScheme="secondary" width='50%' variant='outline' onPress={() => console.log("hello world")}>Delete</Button>
                                </HStack>
                            </VStack>
                        </HStack>
                    </Box>} keyExtractor={item => item.id} />
            </Box>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
        marginHorizontal: 2
    },
    imageCover: {
        width: '20%',
        height: '100%'
    }
});

export default MyBooksPage;