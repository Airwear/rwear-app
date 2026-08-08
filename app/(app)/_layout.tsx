import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, Redirect } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import Strings from '@/constants/Strings';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/contexts/authContext';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={styles.tabIcon} {...props} />;
}

export default function TabLayout() {

  const labels = Strings['fr']['navigation']
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const tabBackground = isDark ? '#121418' : Colors.white;
  const tabBorder = isDark ? '#2A2E34' : '#eceef2';
  const tabInactive = isDark ? '#98A2AD' : Colors.muted;
  const tabActive = Colors.orange;
  const { logged, emailVerified } = useAuth()
  // const rootNavigationState = useRootNavigationState();
  // console.log('rootNavigationState', rootNavigationState?.key)
  
  if (!logged) {
    return <Redirect href="/sign-in" />;
  }

  if (logged && !emailVerified) {
    return <Redirect href="/verify-email" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabActive,
        tabBarInactiveTintColor: tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 3,
        },
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: tabBorder,
          backgroundColor: tabBackground,
          shadowColor: '#111111',
          shadowOpacity: isDark ? 0 : 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -3 },
          elevation: 8,
        },
        tabBarItemStyle: {
          borderRadius: 12,
          marginHorizontal: 4,
          marginTop: 2,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: labels.home,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="podometre"
        options={{
          title: "Podomètre",
          tabBarIcon: ({ color }) => <TabBarIcon name="dashboard" color={color} />,
        }}
      />

      <Tabs.Screen
          name="settings"
          options={{
            title: labels.setting,
            tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
          }}
        />
    </Tabs>
  );
}

const styles = {
  tabIcon: {
    marginBottom: -1,
  },
};
