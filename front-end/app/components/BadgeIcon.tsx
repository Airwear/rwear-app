import { StyleSheet, View, TouchableOpacity, Image,} from 'react-native';
import Title from './Title';
import { BadgeIconType } from '@/utils/type-def';

export default function BadgeIcon({title, subTitle, icon, onPress}: BadgeIconType) {

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>

        <View style={styles.header}>
            <Title text={title} size={17} push={3} weight='bold' />
            <Title text={subTitle ?? ''} size={17} push={3} weight='normal' />
        </View>

        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.image} />
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 110,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f1f5f8',
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 10
  },

  header: {
    flex: 1,
    //backgroundColor: Colors.muted,
  },

  iconContainer: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },

  image: {
    resizeMode: 'cover',
    height: 60,
    width: 60
  },
});
