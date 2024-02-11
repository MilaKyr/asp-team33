import { Input, Icon, Text, Box, Heading, FlatList, HStack, VStack, Spacer, Image, Button } from 'native-base';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import axios from 'axios';


const API_URL = 'http://localhost:8000/api';

const BookDetailPage = ({ navigation, route }) => {
    const item = route.params && route.params.book ? route.params.book : {}
    console.log({ navigation: route.params })



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
                            Courses: {item.courses}
                        </Text>
                        <Text fontSize="xs" fontWeight="500">
                            Uploaded By: {item.name} {item.surname}
                        </Text>
                    </VStack>
                    <HStack width='100%'>
                        <Button size='lg' width='100%' colorScheme="primary" variant='solid' onPress={() => {
                            navigation.navigate('SignUp')
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
        height: '70%'
    }
});

export default BookDetailPage;
