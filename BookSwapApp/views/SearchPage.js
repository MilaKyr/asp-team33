import { Input, Icon, Text, Box, Heading, FlatList, HStack, VStack, Spacer, Image } from 'native-base';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { useState } from 'react';

const API_URL = 'http://localhost:8000/api';

const SearchPage = ({ navigation }) => {
    const [bookResults, setBookResults] = useState([])
    const searchBooks = (text) => {
        console.log({text})
        axios.get(API_URL + `/search?title=${text}`).then((res) => {
            setBookResults(res.data)
        }).catch(() => {})
    }
    return (
        <View style={styles.container}>
            <View style={styles.subsets}>
                <Input onChangeText={(text) => {
                    searchBooks(text)
                }} size="2xl" enterKeyHint='search' placeholder="Search for interested books" variant="rounded" width="100%" fontSize="14" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="search" />} />} />
            </View>
            <Box style={styles.subsets}>
                <Heading fontSize="xl" p="4" pb="3">
                    Top Results
                </Heading>
                <FlatList data={bookResults} renderItem={({
                    item
                }) => <Pressable onPress={() => {
                    navigation.navigate('BookDetail')
                }}>
                        <Box marginBottom={4}>
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
                                        Courses: {item.course}
                                    </Text>
                                </VStack>
                            </HStack>
                        </Box>
                    </Pressable>} keyExtractor={item => item.id} />
            </Box>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subsets: {
        paddingHorizontal: 8
    },
    imageCover: {
        width: '20%',
        height: '100%'
    }
});

export default SearchPage;
