import { FlexContainer, UserHeader } from '@/components';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/Colors';

import { useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/authContext';
import { useApp } from '@/contexts/appContext';
import { VideoTypeList } from '@/components/domains/videos';
import { CastButton } from 'react-native-google-cast';


export default function IndexScreen({navigation}: any) {

  const {authData} = useAuth();
  const {label} = useApp();
  const controller = new AbortController();


  useFocusEffect(useCallback(() => {
    console.log('onFocus')
    return () => {}
  }, []));

  useEffect(() => {
    return () => controller.abort();
  }, [])
  
  return (
    <FlexContainer push>

      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>{label?.navigation?.home || 'Accueil'}</Text>
            <UserHeader userName={authData?.username?.toLocaleUpperCase()} />
          </View>
          <View style={styles.castButtonContainer}>
            <CastButton
              style={styles.castButton}
              tintColor={Colors.black}
            />
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <VideoTypeList />
      </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eceef2',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 13,
    color: Colors.muted,
    marginBottom: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eceef2',
    paddingTop: 6,
  },
  castButtonContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eceef2',
  },
  castButton: {
    width: 26,
    height: 26,
    tintColor: Colors.black,
  },
});
