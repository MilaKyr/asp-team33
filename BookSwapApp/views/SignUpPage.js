import { Button, FormControl, HStack, Heading, Input, Stack, Text, VStack } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';


function SignUpForm({navigation}) {
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
        // validate() ? console.log('Submitted') : console.log('Validation Failed');
        navigation.navigate('SignIn')
    };

    return <VStack width="100%">
        <FormControl isRequired isInvalid={'name' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>First Name</FormControl.Label>
            <Input size='xl' placeholder="First Name..." onChangeText={value => setData({
                ...formData,
                name: value
            })} />
            {'name' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'surname' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Last Name</FormControl.Label>
            <Input size='xl' placeholder="Last Name..." onChangeText={value => setData({
                ...formData,
                surname: value
            })} />
            {'surname' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'email' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Email</FormControl.Label>
            <Input size='xl' placeholder="user@example.com" onChangeText={value => setData({
                ...formData,
                email: value
            })} />
            {'email' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'password' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Password</FormControl.Label>
            <Input size='xl' placeholder="Password..." type='password' onChangeText={value => setData({
                ...formData,
                password: value
            })} />
            {'password' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : null}
        </FormControl>
        <Button size='lg' onPress={onSubmit} mt="5" colorScheme="cyan">
            Register
        </Button>
    </VStack>;
}

const SignUpPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
           <HStack justifyContent='center' mb={8}>
            <Heading>Join Book Swap App</Heading>
           </HStack>
            <SignUpForm navigation={navigation} />
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

export default SignUpPage;
