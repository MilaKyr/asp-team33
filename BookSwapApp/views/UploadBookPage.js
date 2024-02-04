import { Button, FormControl, Input, Stack, VStack } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';


function BookUploadForm() {
    const [formData, setData] = React.useState({});
    const [errors, setErrors] = React.useState({});

    const validate = () => {
        if (formData.name === undefined) {
            setErrors({
                ...errors,
                name: 'Name is required'
            });
            return false;
        } else if (formData.name.length < 3) {
            setErrors({
                ...errors,
                name: 'Name is too short'
            });
            return false;
        }

        return true;
    };

    const onSubmit = () => {
        validate() ? console.log('Submitted') : console.log('Validation Failed');
    };

    return <VStack width="100%">
        <FormControl isRequired isInvalid={'title' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Title</FormControl.Label>
            <Input size='xl' placeholder="Book Title" onChangeText={value => setData({
                ...formData,
                title: value
            })} />
            {'title' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'authors' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Authors</FormControl.Label>
            <Input size='xl' placeholder="Authors (Comma separated e.g. John, Jane)" onChangeText={value => setData({
                ...formData,
                authors: value
            })} />
            {'authors' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'year' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Year</FormControl.Label>
            <Input size='xl' placeholder="Book Year" onChangeText={value => setData({
                ...formData,
                year: value
            })} />
            {'year' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'icbn_10' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>ICBN</FormControl.Label>
            <Input size='xl' placeholder="Book Year" onChangeText={value => setData({
                ...formData,
                icbn_10: value
            })} />
            {'icbn_10' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'bookType' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>ICBN</FormControl.Label>
            <Input size='xl' placeholder="Book Type" onChangeText={value => setData({
                ...formData,
                bookType: value
            })} />
            {'bookType' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <Button size='lg' onPress={onSubmit} mt="5" colorScheme="cyan">
            Upload Book
        </Button>
    </VStack>;
}

const UploadBookPage = () => {
    return (
        <View style={styles.container}>
            <BookUploadForm />
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

export default UploadBookPage;
