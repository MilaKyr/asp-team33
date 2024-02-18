import axios from 'axios';
import { Button, FormControl, HStack, Heading, Input, Stack, Text, VStack } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




const API_URL = 'http://localhost:8000/api';

const validateEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


function SignInForm({navigation, onFormSubmit}) {
    const [formData, setData] = React.useState({});
    const [errors, setErrors] = React.useState({});

    const validate = () => {
        if (formData.email === undefined) {
            setErrors({
                ...errors,
                email: 'Email is required'
            });
            return false;
        } else if (!validateEmail(formData.email)) {
            setErrors({
                ...errors,
                email: 'Email is not valid'
            });
            return false;
        } else if (formData.password === undefined) {
            setErrors({
                ...errors,
                password: 'Password is required'
            });
            return false;
        }

        return true;
    };

    const onSubmit = () => {
        console.log('validating')
        if (validate()) {
            onFormSubmit(formData)
            // navigation.navigate('ScheduleSwap');
        } else {
            console.log('errors:  ', errors)
        }
    };

    return <VStack width="100%">
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
            Login
        </Button>
    </VStack>;
}

const SignInPage = ({ navigation, route }) => {

    console.log(route.params)
    const onFormSubmit = ({email, password}) => {
        axios.post(`${API_URL}/sign_in`, {
            email,
            password
        }).then(res => {
            if (res.data) {
                AsyncStorage.setItem('userToken', String(res.data));
                route.params?.signIn(String(res.data));
            }
            console.log('resultssss===>', res.data)
        }).catch(err => {
            console.log('error===>', err)
        });

    }

    return (
        <View style={styles.container}>
           <HStack justifyContent='center' mb={8}>
            <Heading>Sign In</Heading>
           </HStack>
            <SignInForm onFormSubmit={onFormSubmit} navigation={navigation} />
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

export default SignInPage;
