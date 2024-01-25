import { StyleSheet, View, Text } from 'react-native';

const Header = () => {
  return (
    <View style={styles.title}>
      <Text style={{ fontWeight: 'bold' }}>This is BookSwapApp</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    justifyContent: 'center',
    textAlign: 'center',
    height: '5%',
    width: '100%',
    alignItems: 'center',
  },
});

export default Header;