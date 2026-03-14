import { DropdownType } from '@/utils/type-def';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import Colors from '@/constants/Colors';

export default  function Dropdown({data, onSelect, placeholder, search = false}: DropdownType) {

  const [selected, setSelected] = useState<string>();

  return(
    <View style={styles.container}>
        <SelectList 
            setSelected={(item: string) => setSelected(item)} 
            data={data} 
            save="key"
            placeholder={placeholder}
            search={search}
            onSelect={() => onSelect(selected)}
            boxStyles={styles.box}
            inputStyles={styles.input}
            dropdownStyles={styles.dropdown}
            dropdownTextStyles={styles.dropdownText}
        />
    </View>
  )

};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  box: {
    borderRadius: 12,
    borderColor: '#e2e5ea',
    backgroundColor: '#fcfcfd',
    minHeight: 47,
  },
  input: {
    color: Colors.black,
    fontSize: 15,
  },
  dropdown: {
    borderColor: '#e2e5ea',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  dropdownText: {
    color: Colors.darkColor,
    fontSize: 14,
  },
});