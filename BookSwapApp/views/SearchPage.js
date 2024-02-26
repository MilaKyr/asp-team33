import { Input, Icon, Text, Box, Heading, FlatList, HStack, VStack, ScrollView, Badge, Button } from 'native-base';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import React, { useState } from 'react';
import { API_URL } from '../constants/api';
import { encode as btoa } from 'base-64'



const SearchPage = ({ navigation }) => {
    const [bookResults, setBookResults] = useState([])
    const [locations, setLocations] = useState([])
    const [imageBooks, setimageBook] = useState({})
    const [countryFilter, setCountryFilter] = useState('')

    const searchBooks = (text) => {
        console.log({ text })
        let url = API_URL + `/search?title=${text}`;
        if (countryFilter.length > 0) {
            url = url + `${text ? '' : `''`}` + `&location=${countryFilter}`
        }

        console.log('fetching with search', { url })
        axios.get(url).then((res) => {
            setBookResults(res.data)
            getImages(res.data)
        }).catch(() => { })
    }

    const getBookLocations = (text) => {
        axios.get(API_URL + `/locations`).then((res) => {
            setLocations(res.data)
        }).catch(() => { })
    }


    React.useEffect(() => {
        searchBooks('');
    }, [countryFilter])

    React.useEffect(() => {
        getBookLocations();
    }, [])


    const getImages = (results) => {
        const promises = results.map(book => {
            const bookId = book.book_id;
            const userId = book.user_id;
            return axios.get(API_URL + `/image?book_id=${bookId}&user_id=${userId}`).then((res) => {
                setimageBook({
                    ...imageBooks,
                    [bookId]: res.data
                })
            }).catch(() => { });
        })
        Promise.all(promises).then((res) => {
        }).catch(err => { })
    }

    const getImage = async (image) => {
        return `data:image/png;base64,${image}`;
    }


    const filterLocation = (country = '') => {
        setCountryFilter(country.toLowerCase());
    }

    return (
        <View style={styles.container}>
            <View style={styles.subsets}>
                <Input onChangeText={(text) => {
                    searchBooks(text)
                }} size="2xl" enterKeyHint='search' placeholder="Search for interested books" variant="rounded" width="100%" fontSize="14" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="search" />} />} />
            </View>
            <Box style={styles.subsets}>
                <ScrollView minH='10%' horizontal={true}>
                    <Button onPress={() => {
                        filterLocation('');
                    }} height='50%' size='xs' variant='outline' rounded='2xl' marginX={2} marginY={2} >Clear Filter</Button>
                    {locations.map(location => (
                        <Button onPress={() => {
                            filterLocation(location.country);
                        }} height='50%' size='xs' rounded='2xl' marginX={2} marginY={2} >{location.country}</Button>
                    ))}
                </ScrollView>
                <Heading fontSize="xl" p="4" pb="3">
                    Top Results
                </Heading>
                <FlatList data={bookResults} renderItem={({
                    item
                }) => <Pressable key={item.book_id} onPress={() => {
                    navigation.navigate('BookDetail', {
                        book: item
                    })
                }}>
                        <Box marginBottom={4}>
                            <HStack justifyContent="space-between">
                                <Image rounded='lg' style={styles.imageCover} source={{
                                    uri: getImage(imageBooks[String(item.book_id)])
                                }} alt='image' />
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
