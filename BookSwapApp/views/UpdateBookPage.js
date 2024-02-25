import axios from 'axios';
import { Button, CheckIcon, FormControl, Image, Input, Pressable, ScrollView, Select, Stack, Text, VStack, useToast } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { API_URL } from '../constants/api';

const transformAuthors = (authors = '') => {
    if (authors.trim().length == 0) return [];
    const splitAuthors = authors.split(',');
    return splitAuthors.map(author => {
        const [name, surname] = author.split(' ')
        return { name, surname }
    })
}

const isUndefinedOrEmpty = (field = '') => {
    console.log(field)
    if (Array.isArray(field) && String(field).length == 0) return true;
    if (field == null || String(field).trim?.()?.length === 0) {
        return true;
    }
};

function UpdateBookForm({ book: existingBook }) {
    const [formData, setData] = React.useState({});
    const [courses, setCourses] = React.useState([]);
    const [bookTypes, setBookTypes] = React.useState([]);
    const [errors, setErrors] = React.useState({});
    const [stages, setStages] = React.useState(1);
    const [book, setBook] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const toast = useToast();

    React.useEffect(() => {
        if (existingBook) {
            const formObject = {
                
            }
        }
    }, []);


    const validate = (dataToSend) => {
        console.log({ dataToSend })
        const REQUIRED_FIELDS = [
            'title', 'description', 'authors', 'year', 'course_id', 'book_type_id'
        ]
        let valid = true;
        let errorObject = {}
        Object.entries(dataToSend).forEach(([field, value]) => {
            if (REQUIRED_FIELDS.includes(field) && isUndefinedOrEmpty(value)) {
                errorObject[field] = `${field} is required`
                valid = false;
            }
        })
        setErrors(errorObject);
        console.log({ errorObject })
        console.log('vludate', valid)
        return valid;
    };

    const onImageUpload = async () => {
        try {
            let filename = image.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            let formData = new FormData();
            formData.append('image', { uri: image, name: filename, type });

            const url = `${API_URL}/add_image/${book}`
            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Uploaded the book image', response.data)
            toast.show({
                title: "Image uploaded successfully",
                placement: "bottom"
            })
            setBook(null)
            setStages(1)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const checkForCameraRollPermission = async () => {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        console.log('status', status)
        if (status !== 'granted' && status !== 'undetermined') {
            alert("Please grant camera roll permissions inside your system's settings");
        } else {
            console.log('Media Permissions are granted')
        }
    }

    React.useEffect(() => {
        checkForCameraRollPermission()
    }, []);


    const onSubmit = async () => {
        // validate() ? console.log('Submitted') : console.log('Validation Failed');
        const dataToSend = {
            ...formData,
            authors: transformAuthors(formData.authors),
            book_type_id: formData.book_type_id,
            title: formData.title,
            description: formData.description,
            icbn_10: formData.icbn_10,
            year: formData.year,
            edition: formData.edition,
            course_id: formData.course_id
        }
        if (!validate(dataToSend)) {
            return;
        }
        try {
            const url = `${API_URL}/add_book`
            const response = await axios.post(url, {
                ...dataToSend
            });
            console.log('Uploaded the book', response.data)
            setBook(response.data)
            setStages(2)
            toast.show({
                title: "Book uploaded successfully",
                placement: "bottom"
            })
            setData({})
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getCourses = async () => {
        try {
            const url = `${API_URL}/courses`
            const response = await axios.get(url);
            console.log('get the courses', response.data)
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const getBookTypes = async () => {
        try {
            const url = `${API_URL}/book_types`
            const response = await axios.get(url);
            console.log('get the book_types', response.data)
            setBookTypes(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    React.useEffect(() => {
        getCourses();
        getBookTypes();
    }, [])


    const addImage = async () => {
        let _image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            selectionLimit: 0
        });
        if (!_image.cancelled) {
            const { assets } = _image;
            const asset = assets[0] || {}
            setImage(asset.uri);
        }
    }

    if (stages === 2 && book !== null) {
        console.log({ image, book })
        return (
            <VStack width='100%' height='100%' justifyContent='center' alignItems='center'>
                {
                    image && <Image alt='dynamic image uploaded for book' source={{ uri: image }} style={{ width: '80%', height: 400 }} />
                }
                <Pressable onPress={addImage}>
                    <VStack width='100%' justifyContent='center' alignItems='center'>
                        <AntDesign name="camera" size={40} color="black" />
                        <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                    </VStack>
                </Pressable>
                {image && <Button size='lg' onPress={onImageUpload} mt="5" colorScheme="cyan">
                    Upload Book Image
                </Button>}
            </VStack>
        )
    }

    return <ScrollView>
        <VStack width="100%">
            <FormControl isRequired isInvalid={'title' in errors}>
                <FormControl.Label _text={{
                    bold: true
                }}>Title</FormControl.Label>
                <Input size='xl' placeholder="Book Title" onChangeText={value => setData({
                    ...formData,
                    title: value
                })} />
                {'title' in errors ? <FormControl.ErrorMessage>{errors.title}</FormControl.ErrorMessage> : null}
            </FormControl>
            <FormControl isRequired isInvalid={'description' in errors}>
                <FormControl.Label _text={{
                    bold: true
                }}>Description</FormControl.Label>
                <Input size='xl' placeholder="Book details" onChangeText={value => setData({
                    ...formData,
                    description: value
                })} />
                {'description' in errors ? <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage> : null}
            </FormControl>
            <FormControl isRequired isInvalid={'authors' in errors}>
                <FormControl.Label _text={{
                    bold: true
                }}>Authors</FormControl.Label>
                <Input size='xl' placeholder="Authors (Comma separated e.g. John, Jane)" onChangeText={value => setData({
                    ...formData,
                    authors: value
                })} />
                {'authors' in errors ? <FormControl.ErrorMessage>{errors.authors}</FormControl.ErrorMessage> : null}
            </FormControl>
            <FormControl isRequired isInvalid={'year' in errors}>
                <FormControl.Label _text={{
                    bold: true
                }}>Year</FormControl.Label>
                <Input size='xl' placeholder="Book Year" onChangeText={value => setData({
                    ...formData,
                    year: value
                })} />
                {'year' in errors ? <FormControl.ErrorMessage>{errors.year}</FormControl.ErrorMessage> : null}
            </FormControl>

            <FormControl isRequired isInvalid={'book_type_id' in errors}>
                <FormControl.Label _text={{
                    bold: true
                }}>Upload type</FormControl.Label>
                <Select selectedValue={formData.book_type_id} minWidth="200" accessibilityLabel="Choose Upload Type" placeholder="Choose Upload type" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                }} mt={1} onValueChange={itemValue => {
                    setData({
                        ...formData,
                        book_type_id: itemValue
                    })
                }}>
                    {bookTypes.map(bookType => (
                        <Select.Item label={bookType.name} value={bookType.id} />
                    ))}
                </Select>
                {'book_type_id' in errors ? <FormControl.ErrorMessage>{errors.book_type_id}</FormControl.ErrorMessage> : null}
            </FormControl>

            <FormControl isRequired isInvalid={'course_id' in errors}>
                <FormControl.Label _text={{
                    bold: true
                }}>Course</FormControl.Label>
                <Select selectedValue={formData.course_id} minWidth="200" accessibilityLabel="Choose a course" placeholder="Choose Upload type" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />
                }} mt={1} onValueChange={itemValue => {
                    setData({
                        ...formData,
                        course_id: itemValue
                    })
                }}>
                    {courses.map(course => (
                        <Select.Item label={course.name} value={course.id} />
                    ))}
                </Select>
                {'course_id' in errors ? <FormControl.ErrorMessage>{errors.course_id}</FormControl.ErrorMessage> : null}
            </FormControl>

            <FormControl>
                <FormControl.Label _text={{
                    bold: true
                }}>ICBN</FormControl.Label>
                <Input size='xl' placeholder="Book Year" onChangeText={value => setData({
                    ...formData,
                    icbn_10: value
                })} />
            </FormControl>
            <FormControl>
                <FormControl.Label _text={{
                    bold: true
                }}>Book Edition</FormControl.Label>
                <Input size='xl' placeholder="Edition (optional)" onChangeText={value => setData({
                    ...formData,
                    edition: value
                })} />
            </FormControl>
            <Button size='lg' onPress={onSubmit} mt="5" colorScheme="cyan">
                Upload Book
            </Button>
        </VStack>
    </ScrollView>;
}

const UpdateBookPage = ({ route }) => {
    const item = route.params && route.params.book ? route.params.book : {}

    console.log({ item })
    return (
        <View style={styles.container}>
            <UpdateBookForm book={item} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 4
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

export default UpdateBookPage;
