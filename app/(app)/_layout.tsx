import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, Redirect } from 'expo-router';
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
  const { logged, emailVerified, isGuest } = useAuth()
  // const rootNavigationState = useRootNavigationState();
  // console.log('rootNavigationState', rootNavigationState?.key)
  
  if (!logged && !isGuest) {
    return <Redirect href="/sign-in" />;
  }

  if (logged && !emailVerified) {
    return <Redirect href="/verify-email" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 66,
          paddingTop: 6,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: '#eceef2',
          backgroundColor: '#ffffff',
        },
        tabBarItemStyle: {
          borderRadius: 10,
          marginHorizontal: 2,
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
