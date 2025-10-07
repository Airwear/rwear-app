import { Modal, View, Pressable, StyleSheet, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '@/constants/Colors';

export default function ModalSlide({ isVisible, children, onClose, title = '', height = "100%" }: any) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={[styles.modalContent, {height: height}]}>
        <View style={styles.titleContainer}>

          <Text style={styles.title}>{title}</Text>

          <Pressable style={styles.pressable} onPress={onClose}>
            <MaterialIcons name="close" color={Colors.black} size={22} />
          </Pressable>

        </View>
        <View style={styles.content}>
            {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalContent: {
      height: '60%',
      width: '100%',
      backgroundColor: Colors.white,
      borderTopRightRadius: 18,
      borderTopLeftRadius: 18,
      position: 'absolute',
      bottom: 0,
    },

    titleContainer: {
      height: '10%',
      backgroundColor: Colors.white,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#f1f1f1'
    },

    content: {
      padding: 10,
    },

    title: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },

    pressable: {
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center'
   },
  });
  
