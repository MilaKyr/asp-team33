import { Box, HStack, Heading, Stack, Text } from 'native-base';
import { StyleSheet, Image, Pressable } from 'react-native';
import { encode as btoa } from 'base-64'


const BookShowcaseItem = ({ item, navigation }) => {
    const arrayBufferToBase64ImageString = buffer => {
        const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer.data)));
        return `data:image/jpeg;base64,${base64String}`;
    };
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
                        {/* <Image style={styles.imageCover} source={arrayBufferToBase64ImageString(item.image)} alt='image' /> */}
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