import { Button, FormControl, HStack, Heading, Input, Stack, Text, VStack } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';


function SignInForm({navigation}) {
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
        navigation.navigate('ScheduleSwap')
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

const SignInPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
           <HStack justifyContent='center' mb={8}>
            <Heading>Sign In</Heading>
           </HStack>
            <SignInForm navigation={navigation} />
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
