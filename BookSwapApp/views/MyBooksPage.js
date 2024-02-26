import { Box, Button, FlatList, Flex, HStack, Heading, Image, Pressable, ScrollView, Spinner, Text, VStack, useToast } from 'native-base';
import React from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { API_URL } from '../constants/api';
import axios from 'axios';
import { AuthContext } from '../util/context';

const RenderBookItem = ({ item, navigation }) => {
    const [image, setImage] = React.useState(null);

    const fetchImage = async () => {
        try {
            const response = await axios.get(API_URL + `/image?book_id=${item.book_id}&user_id=${item.user_id}`);
            setImage(response.data)
        } catch (error) {

        }
    }

    React.useEffect(() => {
        fetchImage()
    }, [])

    return (
        <Box key={item.book_id
        } marginBottom={4} marginRight={1}>
            <HStack justifyContent="space-between">
                {image ? <Image style={styles.imageCover} source={{
                    uri: `data:image/png;base64,${image}`
                }} alt='image' /> : null}
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
                        navigation.navigate('SwapOffer', {
                            book: item
                        })
                    }}>View Offers for this book</Button>
                    <HStack width='100%'>
                        <Button width='50%' variant='outline' onPress={() => {
                            navigation.navigate('UpdateBook', {
                                book: item
                            })
                        }}>Update</Button>
                        <Button colorScheme="secondary" width='50%' variant='outline' onPress={() => {
                            deleteBook(item.book_id)
                        }}>Delete</Button>
                    </HStack>
                </VStack>
            </HStack>
        </Box>
    );
}

const MyBooksPage = ({ navigation }) => {
    const [books, setBooks] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const toast = useToast();

    const { signOut } = React.useContext(AuthContext);

    React.useEffect(() => {
        fetchMyBooks()
    }, []);

    const fetchMyBooks = async () => {
        try {
            const url = `${API_URL}/my_books`
            console.log('Fecthing books:');
            const response = await axios.get(url);

            console.log(response.data)
            setBooks(response.data);
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error.response.status);
            toast.show({
                title: "Unable to fetch books",
                placement: "bottom"
            })
            if (error && error.response && error.response.status == 401) {
                signOut()
            }
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
        <ScrollView refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={() => {
                fetchMyBooks()
            }} />
        } style={styles.container}>
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
                        }) => <RenderBookItem item={item} navigation={navigation}  />} keyExtractor={item => item.book_id} />
                )}

            </Box >
        </ScrollView >
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
