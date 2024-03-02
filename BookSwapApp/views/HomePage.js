import { StyleSheet, View } from 'react-native';
import BookShowcase from './BookShowcase';
import CategoryView from './CategoryView';
import { Button, HStack, Icon } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';



const HomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <BookShowcase navigation={navigation} />
      <HStack>
        <Button onPress={() => {
          navigation.navigate('Search')
        }} size='lg' variant='ghost' startIcon={<Icon as={Ionicons} name="search-outline" size="2xl" />}>Search for books based on various criteria</Button>
      </HStack>
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
