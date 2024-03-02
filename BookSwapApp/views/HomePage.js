import { StyleSheet, View } from 'react-native';
import BookShowcase from './BookShowcase';
import CategoryView from './CategoryView';


const HomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <BookShowcase navigation={navigation} />
      <CategoryView navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomePage;
