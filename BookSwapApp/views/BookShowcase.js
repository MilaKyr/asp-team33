import { StyleSheet, View, ScrollView } from 'react-native';
import BookShowcaseItem from '../components/BookShowcaseItem';

// TODO this will be changed with api call
const books = [
    {
        id: 1,
        title: "The Web Application Hacker's Handbook: Finding and Exploiting Security Flaws",
        authors: ["Dafydd Stuttard", "Marcus Pinto"],
        description: "The highly successful security book returns with a new edition, completely updatedWeb applications are the front door to most organizations, exposing them to attacks that may disclose personal information, execute fraudulent transactions, or compromise ordinary users. This practical book has been completely updated and revised to discuss the latest step-by-step techniques for attacking and defending the range of ever-evolving web applications. You'll explore the various new technologies employed in web applications that have appeared since the first edition and review the new attack techniques that have been developed, particularly in relation to the client side",
        edition: "2nd",
        icbn_10: "1118026470",
        image: require('../assets/tim-alex-xG5VJW-7Bio-unsplash.jpg'),
        courses: ["Computer Security"],
        user: {
            id: '1',
            name: 'John',
            surname: 'Doe',
        },
    },
    {
        id: 2,
        title: "The Web Application Hacker's Handbook: Finding and Exploiting Security Flaws",
        authors: ["Dafydd Stuttard", "Marcus Pinto"],
        description: "The highly successful security book returns with a new edition, completely updatedWeb applications are the front door to most organizations, exposing them to attacks that may disclose personal information, execute fraudulent transactions, or compromise ordinary users. This practical book has been completely updated and revised to discuss the latest step-by-step techniques for attacking and defending the range of ever-evolving web applications. You'll explore the various new technologies employed in web applications that have appeared since the first edition and review the new attack techniques that have been developed, particularly in relation to the client side",
        edition: "2nd",
        icbn_10: "1118026470",
        image: require('../assets/tim-alex-xG5VJW-7Bio-unsplash.jpg'),
        courses: ["Computer Security"],
        user: {
            id: '1',
            name: 'John',
            surname: 'Doe',
        },
    },
];

const BookShowcase = () => {
    return (
        <View style={styles.bookShowcase}>
            <ScrollView horizontal showsHorizontalScrollIndicator pagingEnable style={styles.scrollView}>
                {books.map((item) => <BookShowcaseItem item={item} />)}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        height: '100%',
        width: '100%',
    },
    bookShowcase: {
        flex: 1.5,
        height: '100%',
        width: '100%',
    },
});

export default BookShowcase;