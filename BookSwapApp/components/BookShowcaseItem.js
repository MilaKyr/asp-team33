import axios from 'axios';
import { Box, HStack, Heading, Stack, Text } from 'native-base';
import { StyleSheet, Image, Pressable } from 'react-native';
import { API_URL } from '../constants/api';
import React from 'react';


const BookShowcaseItem = ({ item, navigation, index }) => {
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
        <Pressable onPress={() => {
            navigation.navigate('BookDetail', {
                book: item
            })
        }}>
            <Box alignItems="center" height='100%'>
                <Box maxW="80" minHeight='90%' rounded="2xl" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _light={{
                    backgroundColor: "gray.50"
                }}>
                    <Box height='50%'>
                        {image ? <Image style={styles.imageCover} source={{
                            uri: `data:image/png;base64,${image}`
                        }} alt='image' /> : null}
                    </Box>
                    <Stack p="4" space={2}>
                        <Stack space={2}>
                            <Heading isTruncated size="md" ml="-1">
                                {item.title}
                            </Heading>
                            <Text fontSize="xs" _light={{
                                color: "violet.500"
                            }} fontWeight="500" ml="-0.5" mt="-1">
                                by {item.authors.join(", ")}.
                            </Text>
                        </Stack>
                        <Text fontWeight="400">
                            Courses: {item.course}
                        </Text>
                        <HStack alignItems="center" space={2} justifyContent="space-between">
                            <HStack alignItems="center">
                                <Text color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }} fontWeight="400">
                                    <Text style={{ fontStyle: 'italic' }}>Posted by </Text>{item.name} {item.surname}
                                </Text>
                            </HStack>
                        </HStack>
                    </Stack>
                </Box>
            </Box>
        </Pressable>

    );
};

const styles = StyleSheet.create({
    imageCover: {
        width: '100%',
        height: '100%'
    }
});

export default BookShowcaseItem;