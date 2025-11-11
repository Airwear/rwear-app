import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebMapView({uri}: {uri: string}) {
    return <View style={styles.container}>
        <WebView style={styles.mapView} source={{ uri: uri }} />
    </View>
}


const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        height: 150
    },

    mapView: {
        height: 100,
    },
})