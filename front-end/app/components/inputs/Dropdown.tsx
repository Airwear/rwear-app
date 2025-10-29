import { DropdownType } from '@/utils/type-def';
import { useState } from 'react';
import { View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'

export default  function Dropdown({data, onSelect, placeholder}: DropdownType) {

  const [selected, setSelected] = useState<string>();
  console.log('Dropdown', selected)

  return(
    <View style={{marginBottom: 16}}>
        <SelectList 
            setSelected={(item: string) => setSelected(item)} 
            data={data} 
            save="key"
            placeholder={placeholder}
            search={false}
            onSelect={() => onSelect(selected)}
        />
    </View>
  )

};