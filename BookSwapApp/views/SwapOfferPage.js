import { Badge, Box, Button, FlatList, HStack, Heading, Image, Text, VStack, useToast } from 'native-base';
import React from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { API_URL } from '../constants/api';
import { formatDistance } from "date-fns";
import axios from 'axios';
import { OFFER_STATUS, OFFER_TO_SCHEME_MAPPER } from '../constants/enums';

const SwapOfferPage = ({ route }) => {
    const [offers, setOffers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAcceptLoading, setIsAcceptLoading] = React.useState(false);
    const [isDeclineLoading, setIsDeclineLoading] = React.useState(false);
    const toast = useToast();

    const item = route.params && route.params.book ? route.params.book : {}
    const filteredOffers = offers.filter(offer => offer.book_id == item.book_id)

    const fetchSwapOffers = async () => {
        try {
            const url = `${API_URL}/my_swaps`
            console.log('Fecthing books:');
            const response = await axios.get(url);

            console.log({ response: response.data })
            setOffers(response.data);
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.show({
                title: "Unable to fetch swaps",
                placement: "bottom"
            })
        }
    };

    React.useEffect(() => {
        fetchSwapOffers()
    }, [])

    const acceptOffer = async (swapId) => {
        try {
            setIsAcceptLoading(true)
            const url = `${API_URL}/update_swap/${swapId}`
            console.log('Updateing swap request:', url);
            const response = await axios.put(url, {
                status_id: 3
            });
            console.log({ response: response.data })
            fetchSwapOffers()
            setIsAcceptLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.show({
                title: "Unable to update swap",
                placement: "bottom"
            })
            setIsAcceptLoading(false)
        }
    };


    const declineOffer = async (swapId) => {
        try {
            setIsDeclineLoading(true)
            const url = `${API_URL}/update_swap/${swapId}`
            console.log('Updateing swap request:', url);
            const response = await axios.put(url, {
                status_id: 2
            });
            console.log({ response: response.data })
            fetchSwapOffers()
            setIsDeclineLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.show({
                title: "Unable to update swap",
                placement: "bottom"
            })
            setIsDeclineLoading(false)
        }
    };

    if (!isLoading && filteredOffers.length === 0) {
        return (
            <View style={styles.container}>
                <VStack height='100%' width='100%' alignContent='center' justifyContent='center' alignItems='center'>
                    <Heading>No Swap Offers</Heading>
                </VStack>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Box>
                <FlatList refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={() => {
                        fetchSwapOffers()
                    }} />
                } data={filteredOffers} renderItem={({
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
                                    <Button isLoading={isAcceptLoading} width='50%' variant='outline' onPress={() => {
                                        acceptOffer(item.id)
                                    }}>Accept</Button>
                                    <Button isLoading={isDeclineLoading} colorScheme="secondary" width='50%' variant='solid' onPress={() => {
                                        declineOffer(item.id)
                                    }}>Decline</Button>
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

export default SwapOfferPage;
