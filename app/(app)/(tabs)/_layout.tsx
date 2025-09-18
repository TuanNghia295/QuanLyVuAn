import {Tabs} from 'expo-router';
import React from 'react';

import {HapticTab} from '@/components/haptic-tab';
import {IconSymbol} from '@/components/ui/icon-symbol';
import {COLOR} from '@/constants/color';
import {Colors} from '@/constants/theme';
import {useColorScheme} from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        headerTitle: '',
        headerShadowVisible: false,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarActiveTintColor: COLOR.PRIMARY,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Người dùng',
          tabBarIcon: ({color}) => <IconSymbol size={28} name="person.3.fill" color={color} />,
          tabBarActiveTintColor: COLOR.PRIMARY,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({color}) => <IconSymbol size={28} name="bell.fill" color={color} />,
          tabBarActiveTintColor: COLOR.PRIMARY,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({color}) => (
            <IconSymbol size={28} name="person.crop.circle.fill" color={color} />
          ),
          tabBarActiveTintColor: COLOR.PRIMARY,
        }}
      />
    </Tabs>
  );
}
