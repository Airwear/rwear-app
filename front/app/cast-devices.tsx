import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import GoogleCast, { CastDevice } from 'react-native-google-cast';
import { Ionicons } from '@expo/vector-icons';

export default function CastDevicesScreen() {
  const [devices, setDevices] = useState<CastDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  useEffect(() => {
    // Initialize and scan for devices
    scanForDevices();
  }, []);

  const scanForDevices = async () => {
    try {
      setIsScanning(true);
      
      // Make sure Google Cast is initialized
      await GoogleCast.setCastOptions({
        receiverApplicationId: GoogleCast.RECEIVER_ID_CAST_VIDEOS,
      });
      
      // Start discovery
      await GoogleCast.startDiscovery();
      
      // Get available devices
      const availableDevices = await GoogleCast.getCastDevices();
      setDevices(availableDevices);
      
      // Check if we're already connected to a device
      const sessionManager = await GoogleCast.getSessionManager();
      const currentSession = await sessionManager.getCurrentCastSession();
      
      if (currentSession) {
        const connectedDevice = currentSession.getDevice();
        if (connectedDevice) {
          setSelectedDevice(connectedDevice.deviceId);
        }
      }
      
      setIsLoading(false);
      setIsScanning(false);
    } catch (error) {
      console.error('Error scanning for devices:', error);
      setIsLoading(false);
      setIsScanning(false);
      Alert.alert('Error', 'Failed to scan for cast devices. Please try again.');
    }
  };

  const connectToDevice = async (device: CastDevice) => {
    try {
      setIsLoading(true);
      
      // Get the session manager
      const sessionManager = await GoogleCast.getSessionManager();
      
      // Connect to the selected device
      await sessionManager.startSession(device.deviceId);
      
      setSelectedDevice(device.deviceId);
      setIsLoading(false);
      
      Alert.alert('Success', `Connected to ${device.deviceName}`);
    } catch (error) {
      console.error('Error connecting to device:', error);
      setIsLoading(false);
      Alert.alert('Connection Error', 'Failed to connect to the selected device. Please try again.');
    }
  };

  const disconnectFromDevice = async () => {
    try {
      setIsLoading(true);
      
      // Get the session manager
      const sessionManager = await GoogleCast.getSessionManager();
      
      // End the current session
      await sessionManager.endCurrentSession();
      
      setSelectedDevice(null);
      setIsLoading(false);
      
      Alert.alert('Disconnected', 'Successfully disconnected from the device.');
    } catch (error) {
      console.error('Error disconnecting from device:', error);
      setIsLoading(false);
      Alert.alert('Disconnection Error', 'Failed to disconnect from the device. Please try again.');
    }
  };

  const renderDeviceItem = ({ item }: { item: CastDevice }) => {
    const isSelected = selectedDevice === item.deviceId;
    
    return (
      <TouchableOpacity
        style={[styles.deviceItem, isSelected && styles.selectedDevice]}
        onPress={() => isSelected ? disconnectFromDevice() : connectToDevice(item)}
      >
        <Ionicons 
          name={isSelected ? "tv" : "tv-outline"} 
          size={24} 
          color={isSelected ? "#4285F4" : "#333"} 
        />
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.deviceName}</Text>
          <Text style={styles.deviceStatus}>
            {isSelected ? 'Connected' : 'Available'}
          </Text>
        </View>
        <Ionicons 
          name={isSelected ? "checkmark-circle" : "chevron-forward"} 
          size={24} 
          color={isSelected ? "#4285F4" : "#999"} 
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Cast Devices',
        }}
      />
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Available Cast Devices</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={scanForDevices}
          disabled={isScanning}
        >
          <Ionicons name="refresh" size={24} color="white" />
          <Text style={styles.refreshButtonText}>
            {isScanning ? 'Scanning...' : 'Refresh'}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.loadingText}>Loading devices...</Text>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="tv-outline" size={64} color="#999" />
          <Text style={styles.emptyText}>No cast devices found</Text>
          <Text style={styles.emptySubtext}>
            Make sure your devices are on the same network and have casting enabled.
          </Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderDeviceItem}
          keyExtractor={(item) => item.deviceId}
          contentContainerStyle={styles.deviceList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  deviceList: {
    padding: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedDevice: {
    borderColor: '#4285F4',
    backgroundColor: '#f0f7ff',
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
