import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import BookShowcase from './BookShowcase';

const categories = ["Categories", "Another Categories"]

const HomePage = () => {
  return (
    <View style={styles.container}>
      <BookShowcase />
      <View style={styles.categories}>
        {categories.map((item, index) => (
          <View key={index} style={styles.categoryView}>
            <TouchableOpacity style={styles.categoryButton}><Text style={styles.categoryButtonText}>{item}</Text></TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  categories: {
    height: '30%',
    width: '100%',
    flex: 2,
    textAlign: 'center',
    justifyContent: 'space-around'
  },

  categoryView: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  },

  categoryButton: {
    height: '50%',
    width: '70%',
    borderRadius: 4,
    elevation: 15,
    backgroundColor: "#5F4E91",
    justifyContent: 'center',

  },

  categoryButtonText: {
    display: 'flex',
    textAlign: 'center',
    fontSize: 20,

  },
});

export default HomePage;
