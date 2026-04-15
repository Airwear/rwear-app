import { FlexContainer, UserHeader } from '@/components';
import { StyleSheet, View, Text, useColorScheme, Animated, Easing } from 'react-native';
import Colors from '@/constants/Colors';

import { useEffect, useCallback, useRef } from 'react';
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
  const accentSoft = isDark ? 'rgba(255,136,0,0.22)' : 'rgba(255,136,0,0.12)';
  const controller = new AbortController();
  const revealAnim = useRef(new Animated.Value(0)).current;


  useFocusEffect(useCallback(() => {
    console.log('onFocus')
    return () => {}
  }, []));

  useEffect(() => {
    Animated.timing(revealAnim, {
      toValue: 1,
      duration: 460,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return () => controller.abort();
  }, [revealAnim])

  const headerAnimStyle = {
    opacity: revealAnim,
    transform: [{ translateY: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
  };

  const contentAnimStyle = {
    opacity: revealAnim.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 0.2, 1] }),
    transform: [{ translateY: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
  };
  
  return (
    <FlexContainer color={pageBg} push>

      <Animated.View style={[styles.headerContainer, { backgroundColor: surface, borderColor: border }, headerAnimStyle]}>
        <View style={[styles.heroOrb, { backgroundColor: Colors.orange }]} />
        <View style={[styles.heroOrbSecondary, { backgroundColor: accentSoft }]} />
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
      </Animated.View>

      <Animated.View style={[styles.contentContainer, { backgroundColor: surface, borderColor: border }, contentAnimStyle]}> 
        <VideoTypeList />
      </Animated.View>
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
  heroOrbSecondary: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 70,
    left: -30,
    bottom: -42,
    opacity: 0.95,
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
  premiumTag: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  premiumTagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  contentContainer: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingTop: 6,
    shadowColor: '#111111',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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
