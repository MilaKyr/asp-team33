import { Button, FormControl, HStack, Heading, Input, Stack, Text, TextArea, VStack } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { API_URL } from '../constants/api';
import axios from 'axios';


function SwapScheduleForm({ navigation }) {
    const [formData, setData] = React.useState({});
    const [errors, setErrors] = React.useState({});

    // const validate = () => {
    //     if (formData.name === undefined) {
    //         setErrors({
    //             ...errors,
    //             name: 'Name is required'
    //         });
    //         return false;
    //     } else if (formData.name.length < 3) {
    //         setErrors({
    //             ...errors,
    //             name: 'Name is too short'
    //         });
    //         return false;
    //     }

    //     return true;
    // };

    const onSubmit = () => {
        navigation.navigate('SignIn')
    };

    const scheduleSwap = async () => {
        try {
            const url = `${API_URL}/my_books`
            const response = await axios.post(url, {
                book_id: '',
                receiver_id: ''
            });
            console.log('scheduled successfully',response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return <VStack width="100%">
        <FormControl isRequired isInvalid={'address' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Address</FormControl.Label>
            <Input size='xl' placeholder="Enter Address for Swap" onChangeText={value => setData({
                ...formData,
                address: value
            })} />
            {'address' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'date' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Date</FormControl.Label>
            <Input size='xl' placeholder="Date you want to swap" onChangeText={value => setData({
                ...formData,
                date: value
            })} />
            {'date' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'time' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Time</FormControl.Label>
            <Input size='xl' placeholder="Time of swap" onChangeText={value => setData({
                ...formData,
                time: value
            })} />
            {'time' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl>
            <FormControl.Label _text={{
                bold: true
            }}>Additional Notes</FormControl.Label>
            <TextArea h={20} placeholder="Any Extra notes" w="100%" />
        </FormControl>


        <Button size='lg' onPress={onSubmit} mt="5" colorScheme="cyan">
            Schedule Swap
        </Button>
    </VStack>;
}

const SwapSchedulePage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <HStack justifyContent='center' mb={8}>
                <Heading size='md'>Let Them know You're interested</Heading>
            </HStack>
            <SwapScheduleForm navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 4,
        justifyContent: 'center'
    },
});

export default SwapSchedulePage;
