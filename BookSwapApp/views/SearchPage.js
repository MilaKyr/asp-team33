import { Input, Icon, Text, Box, Heading, FlatList, HStack, VStack, ScrollView, Badge, Button } from 'native-base';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import React, { useState } from 'react';
import { API_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const RenderItem = ({ item, navigation }) => {
    const [image, setImage] = React.useState(null);

    const fetchImage = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('systemAccessToken');
            const response = await axios.get(API_URL + `/image?book_id=${item.book_id}&user_id=${item.user_id}`, {
                headers: {
                    Authorization: accessToken
                }
            });
            setImage(response.data)
        } catch (error) {

        }
    }

    React.useEffect(() => {
        fetchImage()
    }, [])


    return (
        <Pressable key={item.book_id} onPress={() => {
            navigation.navigate('BookDetail', {
                book: item
            })
        }}>
            <Box marginBottom={4}>
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
                            by {item.authors.join(", ")}.
                        </Text>
                        <Text fontSize="xs" color="coolGray.800" alignSelf="flex-start">
                            Courses: {item.course}
                        </Text>
                    </VStack>
                </HStack>
            </Box>
        </Pressable>
    );
}

const SearchPage = ({ navigation }) => {
    const [bookResults, setBookResults] = useState([])
    const [locations, setLocations] = useState([])
    const [countryFilter, setCountryFilter] = useState('')

    const searchBooks = (text) => {
        console.log({ text })
        let url = API_URL + `/search?title=${text}`;
        if (countryFilter.length > 0) {
            url = url + `${text ? '' : `''`}` + `&location=${countryFilter}`
        }

        AsyncStorage.getItem('systemAccessToken').then(accessToken => {
            axios.get(url, {
                headers: {
                    Authorization: accessToken
                }
            }).then((res) => {
                setBookResults(res.data)
            }).catch(() => { })
        });
    }

    const getBookLocations = (text) => {
        AsyncStorage.getItem('systemAccessToken').then(accessToken => {
            axios.get(API_URL + `/locations`, {
                headers: {
                    Authorization: accessToken
                }
            }).then((res) => {
                setLocations(res.data)
            }).catch(() => { })
        });
    }


    React.useEffect(() => {
        searchBooks('');
    }, [countryFilter])

    React.useEffect(() => {
        getBookLocations();
    }, [])


    const filterLocation = (country = '') => {
        setCountryFilter(country.toLowerCase());
    }

    return (
        <View style={styles.container}>
            <View style={styles.paddingX}>
                <Input onChangeText={(text) => {
                    searchBooks(text)
                }} size="2xl" enterKeyHint='search' placeholder="Search for interested books" variant="rounded" width="100%" fontSize="14" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="search" />} />} />
            </View>
            <Box style={styles.subsets}>
                <View>
                    <ScrollView height={70} maxHeight={80} horizontal={true}>
                        <Button onPress={() => {
                            filterLocation('');
                        }} height='50%' size='xs' variant='outline' rounded='2xl' marginX={2} marginY={2} >Clear Filter</Button>
                        {locations.map(location => (
                            <Button onPress={() => {
                                filterLocation(location.country);
                            }} height='50%' size='xs' rounded='2xl' marginX={2} marginY={2} >{location.country}</Button>
                        ))}
                    </ScrollView>
                </View>
                <Heading fontSize="xl" p="4" pb="3">
                    Top Results
                </Heading>
                <FlatList data={bookResults} renderItem={({
                    item
                }) => <RenderItem key={item.id} item={item} navigation={navigation} />} keyExtractor={item => item.id} />
            </Box>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    paddingX: {
        paddingHorizontal: 8,
    },
    subsets: {
        paddingHorizontal: 8,
        flex: 1
    },
    imageCover: {
        width: '20%',
        height: '100%'
    }
});

export default SearchPage;
