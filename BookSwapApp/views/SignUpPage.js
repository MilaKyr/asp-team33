import { Button, FormControl, HStack, Heading, Input, Stack, Text, VStack } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthContext } from '../util/context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';



const validateEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

function SignUpForm({ onFormSubmit, isSubmitting }) {
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
        } else if (formData.surname == null || formData.surname == '') {
            setErrors({
                ...errors,
                surname: 'Last name is required.'
            });
            return false;
        } else if (formData.surname.length < 3) {
            setErrors({
                ...errors,
                surname: 'Last name is too short'
            });
            return false;
        } else if (formData.country == null || formData.country == '') {
            setErrors({
                ...errors,
                country: 'Country is required.'
            });
            return false;
        } else if (formData.country.length < 2) {
            setErrors({
                ...errors,
                country: 'Country name is too short'
            });
            return false;
        } else if (formData.city == null || formData.city == '') {
            setErrors({
                ...errors,
                city: 'City is required.'
            });
            return false;
        } else if (formData.city.length < 2) {
            setErrors({
                ...errors,
                city: 'City name is too short'
            });
            return false;
        }
        else if (formData.email === undefined) {
            setErrors({
                ...errors,
                email: 'Email is required'
            });
            return false;
        }
        else if (!validateEmail(formData.email)) {
            setErrors({
                ...errors,
                email: 'Email is not valid'
            });
            return false;
        } else if (formData.password === undefined || formData.password == '') {
            setErrors({
                ...errors,
                password: 'Password is required'
            });
            return false;
        }
        return true;
    };

    const onSubmit = () => {
        setErrors({});
        console.log('validating')
        if (validate()) {
            console.log(formData)
            onFormSubmit(formData)
        } else {
            console.log('errors:  ', errors)
        }
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
            {'name' in errors ? <FormControl.ErrorMessage>Please enter a valid name</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'surname' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Last Name</FormControl.Label>
            <Input size='xl' placeholder="Last Name..." onChangeText={value => setData({
                ...formData,
                surname: value
            })} />
            {'surname' in errors ? <FormControl.ErrorMessage>Please enter a valid last name</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'email' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Email</FormControl.Label>
            <Input autoCapitalize='none' size='xl' placeholder="user@example.com" onChangeText={value => setData({
                ...formData,
                email: value
            })} />
            {'email' in errors ? <FormControl.ErrorMessage>Please enter a valid email</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={'password' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Password</FormControl.Label>
            <Input size='xl' placeholder="Password..." type='password' onChangeText={value => setData({
                ...formData,
                password: value
            })} />
            {'password' in errors ? <FormControl.ErrorMessage>Please enter a valid password</FormControl.ErrorMessage> : null}
        </FormControl>

        <FormControl isRequired isInvalid={'city' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>City</FormControl.Label>
            <Input autoCapitalize='none' size='xl' placeholder="Enter your current city" onChangeText={value => setData({
                ...formData,
                city: value
            })} />
            {'city' in errors ? <FormControl.ErrorMessage>Please enter a valid city</FormControl.ErrorMessage> : null}
        </FormControl>

        <FormControl isRequired isInvalid={'country' in errors}>
            <FormControl.Label _text={{
                bold: true
            }}>Country</FormControl.Label>
            <Input autoCapitalize='none' size='xl' placeholder="Enter your current country" onChangeText={value => setData({
                ...formData,
                country: value
            })} />
            {'country' in errors ? <FormControl.ErrorMessage>Please enter a valid city</FormControl.ErrorMessage> : null}
        </FormControl>



        <Button size='lg' onPress={onSubmit} mt="5" colorScheme="cyan">
            Register
        </Button>
    </VStack>;
}

const SignUpPage = ({ navigation }) => {
    const { signIn } = React.useContext(AuthContext);
    const [isSubmitting, setSubmitting] = React.useState(false)

    const onFormSubmit = ({ email, password, name, surname, city, country }) => {
        setSubmitting(true)
        AsyncStorage.getItem('systemAccessToken').then(accessToken => {
            axios.post(`${API_URL}/sign_up`, {
                email,
                password,
                name,
                surname,
                city,
                country
            }, {
                headers: {
                    Authorization: accessToken
                }
            }).then(res => {
                if (res.data) {
                    AsyncStorage.setItem('userToken', String(res.data));
                    setSubmitting(false)
                    signIn(String(res.data));
                }
            }).catch(err => {
                console.log('error===>', err)
            });
        });

    }

    return (
        <View style={styles.container}>
            <HStack justifyContent='center' mb={8}>
                <Heading>Join Book Swap App</Heading>
            </HStack>
            <SignUpForm isSubmitting={isSubmitting} onFormSubmit={onFormSubmit} navigation={navigation} />
            <Button size="md" variant="ghost" onPress={() => {
                navigation.navigate('SignIn')
            }}>
                Sign In
            </Button>
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
