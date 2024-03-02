import { StyleSheet, View, ScrollView } from 'react-native';
import axios from 'axios';
import BookShowcaseItem from '../components/BookShowcaseItem';
import { useEffect, useState } from 'react';
import { API_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';



const BookShowcase = ({ navigation }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
        try {
          const accessToken = await AsyncStorage.getItem('systemAccessToken');
          const response = await axios.get(API_URL, {
            headers: {
                Authorization: accessToken
            }
        });
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };


    return (
        <View style={styles.bookShowcase}>
            <ScrollView horizontal showsHorizontalScrollIndicator pagingEnable style={styles.scrollView}>
                {data.map((item, index) => <BookShowcaseItem key={`${item.book_id}-${index}`} navigation={navigation} item={item} index={index} />)}
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