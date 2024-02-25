import { Text, Box, HStack, VStack, Image, Button } from 'native-base';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { AuthContext } from '../util/context';
import { API_URL } from '../constants/api';
import axios from 'axios';
import { useToast } from 'native-base';



const BookDetailPage = ({ navigation, route }) => {
    const { isSignedIn } = React.useContext(AuthContext);
    const toast = useToast();
    const item = route.params && route.params.book ? route.params.book : {}


    console.log({ item })


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
                            by {item?.authors?.join(", ")}.
                        </Text>
                        <Text fontSize="xs" color="coolGray.800" alignSelf="flex-start">
                            Courses: {item.course}
                        </Text>
                        <Text fontSize="xs" fontWeight="500">
                            Uploaded By: {item.name} {item.surname}
                        </Text>
                        <Text color="coolGray.800">
                            {item.description}
                        </Text>
                    </VStack>
                    <HStack width='100%'>
                        <Button size='lg' width='100%' colorScheme="primary" variant='solid' onPress={() => {
                            // if (isSignedIn) {
                            //     navigation.navigate('ScheduleSwap')
                            // } else {
                            //     navigation.navigate('SignIn')
                            // }
                            scheduleSwap();
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
        height: '20%'
    }
});

export default BookDetailPage;
