import Header from './views/Header';
import HomePage from './views/HomePage';
import Footer from './views/Footer';
import { SafeAreaView, StyleSheet, Dimensions } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <HomePage />
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
});
