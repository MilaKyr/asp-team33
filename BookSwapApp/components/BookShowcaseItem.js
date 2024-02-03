import { AspectRatio, Box, HStack, Heading, Stack, Text, Image } from 'native-base';
import { StyleSheet, View, ScrollView } from 'react-native';

const BookShowcaseItem = ({ item }) => {
    return (
            <Box alignItems="center">
                <Box maxW="80" rounded="2xl" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _light={{
                    backgroundColor: "gray.50"
                }}>
                    <Box height='50%'>
                            <Image style={styles.imageCover} source={item.image} alt='image'/>
                    </Box>
                    <Stack p="4" space={2}>
                        <Stack space={2}>
                            <Heading size="md" ml="-1">
                                {item.title}
                            </Heading>
                            <Text fontSize="xs" _light={{
                                color: "violet.500"
                            }} fontWeight="500" ml="-0.5" mt="-1">
                                by {item.authors.join(", ")}.
                            </Text>
                        </Stack>
                        <Text fontWeight="400">
                            Courses: {item.courses.join(", ")}
                        </Text>
                        <HStack alignItems="center" space={2} justifyContent="space-between">
                            <HStack alignItems="center">
                                <Text color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }} fontWeight="400">
                                    <Text style={{ fontStyle: 'italic' }}>Posted by </Text>{item.user.name} {item.user.surname}
                                </Text>
                            </HStack>
                        </HStack>
                    </Stack>
                </Box>
            </Box>
    );
};

const styles = StyleSheet.create({
    imageCover: {
        width: '100%',
        height: '100%'
    }
});

export default BookShowcaseItem;