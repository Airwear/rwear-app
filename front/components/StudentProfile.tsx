import { icons } from '@/utils';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Title from './Title';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

export default function StudentProfile() {
    return (
        <TouchableOpacity style={styles.container}>
            <ImageBackground source={icons.bgMan} style={styles.image} imageStyle={{ borderRadius: 10}}>
                <Title text='Maturin Tchoula' size={28} weight='bold' color={Colors.white} push={5} />
                <View style={styles.detailsContainer}>
                    <View style={{flex: 1}}>
                        <Title text='16 ans, Tle C' size={16} color={Colors.white} push={5} />
                    </View>
                    <FontAwesome color={Colors.white} name='arrow-right' size={25} />
                </View>
                
            </ImageBackground>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
      height: 100,
      flexDirection: 'column',
    },

    detailsContainer: {
        flexDirection: 'row'
    },

    image: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      paddingHorizontal:16,
      
    },
    text: {
      color: 'white',
      fontSize: 42,
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: '#000000a0',
    },
  });