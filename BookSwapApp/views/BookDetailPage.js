import { Text, Box, HStack, VStack, Image, Button, ScrollView } from 'native-base';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { AuthContext } from '../util/context';
import { API_URL } from '../constants/api';
import axios from 'axios';
import { useToast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';



const BookDetailPage = ({ navigation, route }) => {
    const { isSignedIn } = React.useContext(AuthContext);
    const [image, setImage] = React.useState(null);
    const toast = useToast();
    const item = route.params && route.params.book ? route.params.book : {}


    console.log({ item })

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


    const scheduleSwap = async () => {
        try {
            console.log({
                book_id: item.book_id,
                receiver_id: item.user_id,
            })
            const url = `${API_URL}/schedule_swap`
            const response = await axios.post(url, {
                book_id: item.book_id,
                receiver_id: item.user_id
            });

            console.log('scheduled successfully', response.data)
            toast.show({
                title: "Swap scheduled successfully!",
                placement: "bottom"
            })
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.show({
                title: "Error scheduling swap",
                placement: "bottom"
            })
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Box marginBottom={4}>
                <VStack justifyContent="space-between">
                    {image ? <Image rounded='lg' style={styles.imageCover} source={{
                        uri:`data:image/png;base64,${image}`
                    }} alt='image' /> : null}
                    <VStack justifyContent='space-between' pl={2} width='100%' minHeight={100}>
                        <Text marginY={3} color="coolGray.800" bold>
                            {item.title}
                        </Text>

                        <Text marginY={2} fontSize="xs" _light={{
                            color: "violet.500"
                        }} fontWeight="500">
                            by {item?.authors?.join(", ")}.
                        </Text>
                        <Text marginY={1} fontSize="xs" color="coolGray.800" alignSelf="flex-start">
                            Courses: {item.course}
                        </Text>
                        <Text marginY={1} fontSize="xs" fontWeight="500">
                            Uploaded By: {item.name} {item.surname}
                        </Text>
                        <Text marginY={3} width='100%' color="coolGray.800">
                            {item.description}
                        </Text>
                    </VStack>
                    <HStack width='100%'>
                        <Button size='lg' width='100%' colorScheme="primary" variant='solid' onPress={() => {
                            scheduleSwap();
                        }}>Schedule Swap</Button>
                    </HStack>
                    <HStack height={20}></HStack>
                </VStack>
            </Box>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 2,
    },
    imageCover: {
        width: '100%',
        height: 300
    }
});

export default BookDetailPage;
