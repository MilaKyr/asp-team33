import { StyleSheet, View } from 'react-native';
import BookShowcase from './BookShowcase';
import CategoryView from './CategoryView';


const HomePage = () => {
  return (
    <View style={styles.container}>
      <BookShowcase />
      <CategoryView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomePage;
