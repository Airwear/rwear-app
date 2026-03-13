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
            <Title text={label.navigation.my_space} size={26} push={3} weight='bold' />
            <Title text={userName} size={12} push={0} color={Colors.muted} />
        </View>

        <TouchableOpacity onPress={() => router.navigate('/edit-user')} style={styles.iconContainer}>
          <FontAwesome name='user-circle' size={28} color={Colors.darkColor} />
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 2,
    paddingHorizontal: 2,
    alignItems: 'center',
  },

  header: {
    flex: 1,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.lightColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eceef2',
  },

  textBody: {
    fontSize: 20,
  },
});
