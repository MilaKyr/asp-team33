import { StyleSheet, View, ScrollView } from 'react-native';
import axios from 'axios';
import BookShowcaseItem from '../components/BookShowcaseItem';
import { useEffect, useState } from 'react';
import { API_URL } from '../constants/api';



const BookShowcase = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
        try {
          const response = await axios.get(API_URL);

          console.log('============?')
          const res = response.data.map(x => x.image);
          
          console.log({ response: res  })
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };


    return (
        <View style={styles.bookShowcase}>
            <ScrollView horizontal showsHorizontalScrollIndicator pagingEnable style={styles.scrollView}>
                {data.map((item) => <BookShowcaseItem item={item} />)}
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