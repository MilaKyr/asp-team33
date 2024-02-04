import { Box, Button, FlatList, Flex, HStack, Heading, Image, Pressable, Text, VStack } from 'native-base';
import { StyleSheet, View } from 'react-native';


const mySwapOffers = Array.from([1, 2], (index) => {
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

const ActionItem = ({ item }) => (
    <Box alignItems="center" width='50%'>
        <Pressable>
            {({
                isHovered,
                isPressed
            }) => {
                return <Box bg={isPressed ? "blue.700" : isHovered ? "blue.700" : "blue.500"} style={{
                    transform: [{
                        scale: isPressed ? 0.96 : 1
                    }],
                    minWidth: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 0,
                    flexDirection: 'row'
                }} p="5" rounded="8" shadow={3} borderWidth="1" borderColor="coolGray.300">
                    <Text color="white" mt="3" fontWeight="medium" fontSize="md">
                        {item}
                    </Text>
                </Box>
            }}
        </Pressable>
    </Box>
)


const MyBooksPage = () => {
    return (
        <View style={styles.container}>
            <Flex direction='row'>
                <ActionItem item={"My Swap Request"} />
                <ActionItem item={"Upload New Book"} />
            </Flex>
            <Box>
                <Heading fontSize="xl" p="4" pb="3">
                    My Swap Requests
                </Heading>
                <FlatList data={mySwapOffers} renderItem={({
                    item
                }) => <Box marginBottom={4}>
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
                                <Button onPress={() => console.log("hello world")}>View Offers for this book</Button>
                                <Button onPress={() => console.log("hello world")}>Click Me</Button>
                                <Button onPress={() => console.log("hello world")}>Click Me</Button>
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
