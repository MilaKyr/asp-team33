import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';

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
                {books.map((item) => (
                    <View key={item.id} style={styles.scrollViewItem}>
                        <Image style={styles.scrollViewImage} source={item.image} resizeMethod='resize' resizeMode='contain' />
                        <View style={styles.scrollViewInfoBox}>
                            <View style={{ paddingBottom: 40 }}>
                                <Text style={styles.textCourses}>Courses: {item.courses.join(", ")}</Text>
                            </View>
                            <Text style={styles.textTitle}>{item.title}</Text>
                            <Text style={styles.textAuthors}>by {item.authors.join(", ")}.</Text>
                            <Text style={styles.textEdition}>{item.edition} Edition</Text>

                            <View style={{ paddingTop: 20 }}>
                                <Text style={styles.textAuthors}>
                                    <Text style={{ fontStyle: 'italic' }}>Posted by </Text>{item.user.name} {item.user.surname}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
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
        backgroundColor: "#162955",
        flex: 3,
        height: '100%',
        width: '100%',
    },

    scrollViewItem: {
        flexDirection: 'row',
        backgroundColor: '#F5FCFF',
        margin: 10,
        marginHorizontal: 10,
        flex: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    scrollViewImage: {
        width: '40%',
        height: '90%'
    },

    scrollViewInfoBox: {
        width: '60%',
        flexDirection: 'column',
        padding: 2
    },


    textTitle: {
        paddingBottom: 10,
        textAlign: 'left',
        fontSize: 16,
    },

    textAuthors: {
        textAlign: 'left',
        fontSize: 12,
        fontStyle: 'italic',
    },

    textEdition: {
        color: '#808080',
        textAlign: 'left',
        fontSize: 12,
    },

    textCourses: {
        color: '#8E7B4F',
        textAlign: 'left',
        fontSize: 16,
        fontStyle: 'italic'
    },
});

export default BookShowcase;