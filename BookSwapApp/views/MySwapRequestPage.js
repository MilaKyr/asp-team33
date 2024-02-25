import axios from 'axios';
import { Badge, Box, Button, FlatList, HStack, Heading, Image, Text, VStack, useToast } from 'native-base';
import React from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { API_URL } from '../constants/api';
import { formatDistance } from "date-fns";
import { OFFER_STATUS, OFFER_TO_SCHEME_MAPPER } from '../constants/enums';


const mySwapRequests = Array.from([1, 2], (index) => {
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


const MySwapRequestPage = () => {
    const [swapRequests, setSwapRequests] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDeclineLoading, setIsDeclineLoading] = React.useState(null);
    const toast = useToast();

    const fetchSwapRequests = async () => {
        try {
            const url = `${API_URL}/sent_swaps`
            console.log('Fecthing books:');
            const response = await axios.get(url);

            console.log({ response: response.data })
            setSwapRequests(response.data);
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.show({
                title: "Unable to fetch swap requests",
                placement: "bottom"
            })
        }
    };

    const declineOffer = async (swapId) => {
        try {
            setIsDeclineLoading(swapId)
            const url = `${API_URL}/update_swap/${swapId}`
            console.log('Updateing swap request:', url);
            const response = await axios.put(url, {
                status_id: 2
            });
            console.log({ response: response.data })
            fetchSwapRequests()
            setIsDeclineLoading(null)
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.show({
                title: "Unable to update swap",
                placement: "bottom"
            })
            setIsDeclineLoading(null)
        }
    };

    React.useEffect(() => {
        fetchSwapRequests()
    }, [])

    return (
        <View style={styles.container}>
            <Box>
                <FlatList data={swapRequests}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={() => {
                            fetchSwapRequests()
                        }} />
                    }
                    renderItem={({
                        item
                    }) => <Box marginBottom={4} marginRight={1}>
                            <HStack justifyContent="space-between">
                                <Image rounded='lg' style={styles.imageCover} source={item.image} alt='image' />
                                <VStack justifyContent='space-between' pl={2} width='80%' minHeight={100}>
                                    <Text color="coolGray.800" bold>
                                        User: {item.sender_user_id}
                                    </Text>
                                    <Badge colorScheme={OFFER_TO_SCHEME_MAPPER[OFFER_STATUS[item.status_id]]}>{OFFER_STATUS[item.status_id]}</Badge>
                                    <Text fontSize="xs" color="coolGray.800" alignSelf="flex-start">
                                        Requested: {formatDistance(item.request_date, new Date(), { addSuffix: true })}
                                    </Text>
                                    <HStack width='100%'>
                                        <Button isLoading={isDeclineLoading == item.id} width='100%' colorScheme="secondary" variant='solid' onPress={() => {
                                            declineOffer(item.id)
                                        }}>Rescind Request</Button>
                                    </HStack>
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

export default MySwapRequestPage;
