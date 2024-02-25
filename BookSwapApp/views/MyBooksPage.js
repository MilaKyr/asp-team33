import { Box, Button, FlatList, Flex, HStack, Heading, Image, Pressable, Spinner, Text, VStack, useToast } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { API_URL } from '../constants/api';
import axios from 'axios';

const MyBooksPage = ({ navigation }) => {
    const [books, setBooks] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const toast = useToast();

    React.useEffect(() => {
        fetchMyBooks()
    }, []);

    const fetchMyBooks = async () => {
        try {
            const url = `${API_URL}/my_books`
            const response = await axios.get(url);
            setBooks(response.data);
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.show({
                title: "Unable to fetch books",
                placement: "bottom"
            })
        }
    };

    const deleteBook = async (bookId) => {
        try {
            const url = `${API_URL}/my_book/${bookId}`
            await axios.delete(url);
            fetchMyBooks();
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.show({
                title: "Unable to delete book",
                placement: "bottom"
            })
        }
    };


    return (
        <View style={styles.container}>
            <Flex direction='row'>
                <Button width='50%' size='lg' variant='outline' onPress={() => {
                    navigation.navigate('SwapRequest')
                }}>My Swap Request</Button>
                <Button size='lg' width='50%' variant='outline' onPress={() => {
                    navigation.navigate('UploadBook')
                }}>Upload New Book</Button>
            </Flex>
            <Box>
                <Heading fontSize="xl" p="4" pb="3">
                    My Books
                </Heading>
                {isLoading ? (
                    <Spinner size="lg" />
                ) : (
                    <FlatList data={books} renderItem={
                        ({
                            item
                        }) => <Box key={item.book_id
                        } marginBottom={4} marginRight={1}>
                                <HStack justifyContent="space-between">
                                    <Image rounded='lg' style={styles.imageCover} source={item.image} alt='image' />
                                    <VStack justifyContent='space-between' pl={2} width='80%' minHeight={100}>
                                        <Text color="coolGray.800" bold>
                                            {item.title}
                                        </Text>
                                        <Text fontSize="xs" _light={{
                                            color: "violet.500"
                                        }} fontWeight="500">
                                            by {item.author}.
                                        </Text>
                                        <Text fontSize="xs" color="coolGray.800" alignSelf="flex-start">
                                            Course: {item.course}
                                        </Text>
                                        <Button onPress={() => {
                                            navigation.navigate('SwapOffer')
                                        }}>View Offers for this book</Button>
                                        <HStack width='100%'>
                                            <Button width='50%' variant='outline' onPress={() => console.log("hello world")}>Update</Button>
                                            <Button colorScheme="secondary" width='50%' variant='outline' onPress={() => {
                                                deleteBook(item.book_id)
                                            }}>Delete</Button>
                                        </HStack>
                                    </VStack>
                                </HStack>
                            </Box>} keyExtractor={item => item.book_id} />
                )}

            </Box >
        </View >
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
