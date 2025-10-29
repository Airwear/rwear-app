import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Title from './Title';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/hooks/useApp';

export default function UserHeader({userName = ''}: {userName?: string}) {

  const {label} = useApp()
  
  return (
    <View style={styles.container}>

        <View style={styles.header}>
            <Title text={label.navigation.my_space} size={30} push={5} weight='bold' />
            <Title text={userName} size={12} push={5} />
        </View>

        <TouchableOpacity onPress={() => router.navigate('/edit-user')} style={styles.iconContainer}>
          <FontAwesome name='user-circle' size={35} color={Colors.muted} />
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    width: '100%',
    //backgroundColor: Colors.muted,
    padding: 4,
    alignItems: 'center'
  },

  header: {
    flex: 1,
    //backgroundColor: Colors.muted,
  },

  iconContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  textBody: {
    fontSize: 20,
  },
});
