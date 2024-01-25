import { StyleSheet, StatusBar, SafeAreaView, Text, TouchableOpacity } from 'react-native';

const Footer = () => {
    return (
        <SafeAreaView style={styles.footer}>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Home</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Search</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Upload</Text></TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    footer: {
        height: '10%',
        flexDirection: 'row',
        marginTop: StatusBar.currentHeight || 0,
        justifyContent: 'space-between',
        alignItems: 'stretch',
        alignContent: 'stretch',
    },

    button: {
        width: '30%',
        height: '85%',
        alignSelf: 'center',
        borderRadius: 4,
        elevation: 5,
        backgroundColor: "#4F628E",
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'space-around',
    },

    buttonText: {
        display: 'flex',
        textAlign: 'center',
        fontSize: 20,
    },
});

export default Footer;