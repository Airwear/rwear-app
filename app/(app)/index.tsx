import { BadgeIcon, FlexContainer, UserHeader } from '@/components';
import { ScrollView, RefreshControl, StyleSheet, View,} from 'react-native';

import { useEffect, useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { _get, } from '@/services/api';
import { useAuth } from '@/contexts/authContext';
import { useApp } from '@/contexts/appContext';
import { VideoTypeList } from '@/components/domains/videos';
import { CastButton } from 'react-native-google-cast';


export default function IndexScreen({navigation}: any) {

  const {authData} = useAuth();
  const {label} = useApp()
  const [loading, isLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const controller = new AbortController();


  const onRefresh = useCallback(() => {
    
    setRefreshing(true);
    console.log('refreshing@false')

    setTimeout(() => setRefreshing(false), 1000)

  }, []);

  
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
        <UserHeader userName={authData?.username?.toLocaleUpperCase()} />
        <CastButton
          style={styles.castButton}
          tintColor="#000000"
        />
      </View>

      <VideoTypeList />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        
      </ScrollView>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
  },
  castButton: {
    marginTop: 8,
    width: 48,
    height: 48,
    tintColor: '#000000',
  },
});
