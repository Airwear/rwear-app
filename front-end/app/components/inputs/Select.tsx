import {Picker} from '@react-native-picker/picker';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

export default function Select() {
    const [selectedLanguage, setSelectedLanguage] = useState<string>();

    return (
        <View>
            <Picker
                style={styles.container}
                mode='dropdown'
                numberOfLines={1}
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedLanguage(itemValue)
                }>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
                <Picker.Item label="Swift" value="sw" />
                <Picker.Item label="Pytoh" value="py" />
            </Picker>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    }
})