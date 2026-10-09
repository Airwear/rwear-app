import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

type CallControlButtonProps = {
  label: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  onPress: () => void;
  active?: boolean;
  variant?: 'neutral' | 'danger';
};

export function CallControlButton({
  label,
  iconName,
  onPress,
  active = true,
  variant = 'neutral',
}: CallControlButtonProps) {
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isDanger ? styles.buttonDanger : styles.buttonNeutral,
        !active && !isDanger ? styles.buttonInactive : null,
        pressed ? styles.buttonPressed : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.iconWrap, isDanger ? styles.iconWrapDanger : styles.iconWrapNeutral]}>
        <FontAwesome
          name={iconName}
          size={16}
          color={isDanger ? Colors.white : active ? Colors.darkColor : Colors.muted}
        />
      </View>
      <Text style={[styles.label, isDanger ? styles.labelDanger : styles.labelNeutral]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonNeutral: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DEE3EA',
  },
  buttonDanger: {
    backgroundColor: '#D63D3D',
    borderColor: '#D63D3D',
  },
  buttonInactive: {
    backgroundColor: '#F4F6F8',
  },
  buttonPressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  iconWrapNeutral: {
    backgroundColor: '#F3F5F8',
  },
  iconWrapDanger: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  labelNeutral: {
    color: Colors.darkColor,
  },
  labelDanger: {
    color: Colors.white,
  },
});