import { StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import ImageViewer from './ImageViewer';
import Colors from '@/constants/Colors';

export default function Card({ placeholderImageSource, children, textFooter, textBody}: any) {
  
  return (
    <View style={styles.content}>
        <View style={styles.header}>
            <ImageViewer height={170} placeholderImageSource={placeholderImageSource} />
        </View>

        <View style={styles.body}>
            <Text style={styles.textBody}>{textBody}</Text>
        </View>

        <View style={styles.footer}>
            <TouchableOpacity>
                <Text style={styles.textFooter}>En savoir +</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    height: 320,
    //width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    borderColor: '#ccc',
    width: '100%',
    backgroundColor: Colors.white,
    ...Platform.select({
        ios: {
            shadowColor: "#ccc",
            shadowOffset: {
                width: 3,
                height: 4,
            },
            shadowOpacity: 0.30,
            shadowRadius: 5,
        },
        android: {
          elevation: 5,
        },
    }),

    
  },
  header: {
    height: 170,
    width: '100%'
  },

  body: {
    height: 80,
    padding: 16,
    justifyContent: 'center'
  },

  textBody: {
    fontSize: 20,
  },

  footer: {
    height: 60,
    padding: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },

  textFooter: {
    fontSize: 17,
    color: Colors.muted
  },
});
