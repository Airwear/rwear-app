import { FlexContainer, UserHeader } from '@/components';
import { StyleSheet, View, Text, useColorScheme } from 'react-native';
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
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const pageBg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const muted = isDark ? '#9AA3AD' : Colors.muted;
  const text = isDark ? Colors.white : Colors.darkColor;
  const controller = new AbortController();


  useFocusEffect(useCallback(() => {
    console.log('onFocus')
    return () => {}
  }, []));

  useEffect(() => {
    return () => controller.abort();
  }, [])
  
  return (
    <FlexContainer color={pageBg} push>

      <View style={[styles.headerContainer, { backgroundColor: surface, borderColor: border }]}>
        <View style={[styles.heroOrb, { backgroundColor: Colors.orange }]} />
        <View style={styles.headerTopRow}>
          <View style={styles.userInfo}>
            <Text style={[styles.welcomeText, { color: muted }]}>{label?.navigation?.home || 'Accueil'}</Text>
            <UserHeader userName={authData?.username?.toLocaleUpperCase()} />
            <Text style={[styles.heroDescription, { color: muted }]}>Explore les categories, choisis ta seance et caste en un geste.</Text>
          </View>
          <View style={[styles.castButtonContainer, { backgroundColor: pageBg, borderColor: border }]}>
            <CastButton
              style={styles.castButton}
              tintColor={text}
            />
          </View>
        </View>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: surface, borderColor: border }]}> 
        <VideoTypeList />
      </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#111111',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  heroOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 100,
    right: -70,
    top: -95,
    opacity: 0.18,
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
    marginBottom: 4,
    fontWeight: '600',
  },
  heroDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    paddingRight: 8,
  },
  contentContainer: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingTop: 6,
  },
  castButtonContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  castButton: {
    width: 26,
    height: 26,
    tintColor: Colors.black,
  },
});
