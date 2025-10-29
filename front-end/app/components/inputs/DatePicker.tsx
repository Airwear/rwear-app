import Colors from '@/constants/Colors';
import { DateType } from '@/utils/type-def';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Button, Text, View, Platform, StyleSheet, TouchableOpacity } from 'react-native';


export default function DatePicker({date, onSelect}: DateType) {
    return Platform.OS === 'android' 
        ? <DatePickerAdroid date={date} onSelect={onSelect} /> 
        : <DatePickerIOS date={date} onSelect={onSelect} />
}

function DatePickerAdroid({date, onSelect}: DateType) {

    const [value, setDate] = useState(new Date);
  
    const onChange = (event: any, selectedDate: any) => {
      const currentDate = selectedDate;
      onSelect(currentDate)
      setDate(currentDate);
    };
  
    const showMode = (currentMode: any) => {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: true,
      });
    };
  
    const showDatepicker = () => {
      showMode('date');
    };
  

    return (
      <TouchableOpacity onPress={showDatepicker} style={styles.touchable}>
        <Text>{value.toLocaleString()}</Text>
      </TouchableOpacity>
    );
  };

function DatePickerIOS({date, onSelect}: DateType) {
    const [value, setDate] = useState<Date>(new Date);
  
    const onChange = (event: any, selectedDate: any) => {
      const currentDate = selectedDate;
      setDate(currentDate);
      onSelect(currentDate)
    };

    return (
      <View style={styles.container}>
        <DateTimePicker
            style={styles.input}
            testID="dateTimePicker"
            value={date}
            mode='date'
            is24Hour={true}
            onChange={onChange}
            locale="fr-FR"
          />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
    },

    input: {
    },

    touchable: {
        backgroundColor: '#dedee0',
        height: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
    
  })