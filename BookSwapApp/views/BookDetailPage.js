import { Input, Icon, Text, Box, Heading, FlatList, HStack, VStack, Spacer, Image, Button } from 'native-base';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// TODO this will be changed with api call
const item = {
    id: 1,
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
};

const BookDetailPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Box marginBottom={4}>
                <VStack justifyContent="space-between">
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
                        <Text fontSize="xs" fontWeight="500">
                            Uploaded By: {item.user.name} {item.user.surname}
                        </Text>
                    </VStack>
                    <HStack width='100%'>
                        <Button size='lg' width='100%' colorScheme="primary" variant='solid' onPress={() => {
                            navigation.navigate('SignUp')
                        }}>Schedule Swap</Button>
                    </HStack>
                </VStack>
            </Box>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 2
    },
    imageCover: {
        width: '100%',
        height: '70%'
    }
});

export default BookDetailPage;
