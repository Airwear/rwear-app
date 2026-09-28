import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Colors from '@/constants/Colors';
import { Form, ModalSlide } from '@/components';
import { ButtonSimple } from '@/components/buttons';
import { ServiceMode, ServiceSpecialty } from '@/src/features/services/types';
import { CatalogFilterState } from '@/src/features/services/hooks/useServicesCatalog';

type Props = {
  visible: boolean;
  onClose: () => void;
  filters: CatalogFilterState;
  specialties: ServiceSpecialty[];
  onApply: (next: CatalogFilterState) => void;
};

const modeOptions = [
  { key: 'any', value: 'Tous les modes' },
  { key: 'cabinet', value: 'Cabinet' },
  { key: 'domicile', value: 'Domicile' },
  { key: 'online', value: 'En ligne' },
];

const distanceOptions = [
  { key: 'any', value: 'Sans limite' },
  { key: '2', value: '2 km' },
  { key: '5', value: '5 km' },
  { key: '10', value: '10 km' },
];

function FilterDropdown({
  data,
  placeholder,
  onSelect,
}: {
  data: Array<{ key: string; value: string }>;
  placeholder: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.dropdownContainer}>
      <SelectList
        setSelected={(item: string) => {
          onSelect(item);
        }}
        data={data}
        save="key"
        placeholder={placeholder}
        search={false}
        boxStyles={styles.box}
        inputStyles={styles.input}
        dropdownStyles={styles.dropdown}
        dropdownTextStyles={styles.dropdownText}
      />
    </View>
  );
}

export function ServicesFilterModal({ visible, onClose, filters, specialties, onApply }: Props) {
  const [localSpecialty, setLocalSpecialty] = React.useState<string | undefined>(filters.specialtyId);
  const [localMode, setLocalMode] = React.useState<ServiceMode | undefined>(filters.mode);
  const [localDistance, setLocalDistance] = React.useState<number | undefined>(filters.maxDistanceKm);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const muted = isDark ? '#9AA3AD' : Colors.muted;

  React.useEffect(() => {
    setLocalSpecialty(filters.specialtyId);
    setLocalMode(filters.mode);
    setLocalDistance(filters.maxDistanceKm);
  }, [filters.maxDistanceKm, filters.mode, filters.specialtyId, visible]);

  const specialtyOptions = [
    { key: 'any', value: 'Toutes les spécialités' },
    ...specialties.map((item) => ({ key: item.id, value: item.name })),
  ];
  const selectedSpecialtyLabel = localSpecialty
    ? specialtyOptions.find((item) => item.key === localSpecialty)?.value
    : undefined;
  const selectedModeLabel = localMode
    ? modeOptions.find((item) => item.key === localMode)?.value
    : undefined;
  const selectedDistanceLabel = typeof localDistance === 'number'
    ? distanceOptions.find((item) => item.key === String(localDistance))?.value
    : undefined;

  return (
    <ModalSlide isVisible={visible} onClose={onClose} title="Filtres" height="80%">
      <View style={styles.container}>
        <Text style={[styles.label, { color: muted }]}>Spécialité</Text>
        <FilterDropdown
          data={specialtyOptions}
          placeholder={selectedSpecialtyLabel || 'Toutes les spécialités'}
          onSelect={(value: string) => setLocalSpecialty(value === 'any' ? undefined : value)}
        />

        <Text style={[styles.label, { color: muted }]}>Mode</Text>
        <FilterDropdown
          data={modeOptions}
          placeholder={selectedModeLabel || 'Tous les modes'}
          onSelect={(value: string) => setLocalMode(value === 'any' ? undefined : (value as ServiceMode))}
        />

        <Text style={[styles.label, { color: muted }]}>Distance maximale</Text>
        <FilterDropdown
          data={distanceOptions}
          placeholder={selectedDistanceLabel || 'Sans limite'}
          onSelect={(value: string) => setLocalDistance(value === 'any' ? undefined : Number(value))}
        />

        <View style={styles.actions}>
          <ButtonSimple
            text="Réinitialiser"
            color={Colors.darkColor}
            onPress={() => {
              const reset = {
                ...filters,
                specialtyId: undefined,
                mode: undefined,
                maxDistanceKm: undefined,
              };
              onApply(reset);
              onClose();
            }}
          />

          <View style={styles.spacer} />

          <ButtonSimple
            text="Appliquer"
            color={Colors.primary}
            onPress={() => {
              onApply({
                ...filters,
                specialtyId: localSpecialty,
                mode: localMode,
                maxDistanceKm: localDistance,
              });
              onClose();
            }}
          />
        </View>
      </View>
    </ModalSlide>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  dropdownContainer: {
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
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  actions: {
    marginTop: 12,
  },
  spacer: {
    height: 10,
  },
});
