import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';

interface CastDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'airplay';
  isConnected: boolean;
}

interface CastContextType {
  devices: CastDevice[];
  currentDevice: CastDevice | null;
  isConnected: boolean;
  isCasting: boolean;
  scanForDevices: () => void;
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  castVideo: (videoUrl: string, title: string, thumbnail?: string) => Promise<void>;
  stopCasting: () => Promise<void>;
}

const CastContext = createContext<CastContextType | undefined>(undefined);

export const CastProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<CastDevice[]>([]);
  const [currentDevice, setCurrentDevice] = useState<CastDevice | null>(null);
  const [isCasting, setIsCasting] = useState(false);

  useEffect(() => {
    initializeCast();
    return () => {};
  }, []);

  const initializeCast = async () => {
    if (Platform.OS === 'android') {
      try {
        console.log('Cast SDK initialized');
      } catch (error) {
        console.error('Error initializing Cast SDK:', error);
      }
    }
  };

  const scanForDevices = () => {
    console.log('Scanning for cast devices...');
    const mockDevices: CastDevice[] = [
      { id: '1', name: 'Living Room TV', type: 'chromecast', isConnected: false },
      { id: '2', name: 'Bedroom Chromecast', type: 'chromecast', isConnected: false },
    ];
    setDevices(mockDevices);
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      const device = devices.find(d => d.id === deviceId);
      if (device) {
        setCurrentDevice({ ...device, isConnected: true });
        console.log(`Connected to ${device.name}`);
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      if (currentDevice) {
        console.log(`Disconnected from ${currentDevice.name}`);
        setCurrentDevice(null);
        setIsCasting(false);
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const castVideo = async (videoUrl: string, title: string, thumbnail?: string) => {
    try {
      if (!currentDevice) {
        throw new Error('No device connected');
      }
      console.log(`Casting video: ${title} to ${currentDevice.name}`);
      setIsCasting(true);
    } catch (error) {
      console.error('Error casting video:', error);
      throw error;
    }
  };

  const stopCasting = async () => {
    try {
      console.log('Stopping cast');
      setIsCasting(false);
    } catch (error) {
      console.error('Error stopping cast:', error);
    }
  };

  return (
    <CastContext.Provider
      value={{
        devices,
        currentDevice,
        isConnected: !!currentDevice,
        isCasting,
        scanForDevices,
        connectToDevice,
        disconnect,
        castVideo,
        stopCasting,
      }}
    >
      {children}
    </CastContext.Provider>
  );
};

export const useCast = () => {
  const context = useContext(CastContext);
  if (context === undefined) {
    throw new Error('useCast must be used within a CastProvider');
  }
  return context;
};
