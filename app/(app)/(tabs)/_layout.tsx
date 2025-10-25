import {HapticTab} from '@/components/haptic-tab';
import {IconSymbol} from '@/components/ui/icon-symbol.ios';
import {COLOR} from '@/constants/color';
import {Colors} from '@/constants/theme';
import {useColorScheme} from '@/hooks/use-color-scheme';
import {useUnreadNoti} from '@/hooks/useNotifications';
import usePushNotifications from '@/hooks/usePushNotifications';
import {useUserStore} from '@/store/userStore';
import {useQueryClient} from '@tanstack/react-query';
import {Stack, Tabs} from 'expo-router';
import React, {useEffect, useRef} from 'react';
import {AppState, Text, View} from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {userInfo} = useUserStore();
  const {data: unreadNoti, refetch: refetchUnreadNoti} = useUnreadNoti();
  const {expoPushToken, notification} = usePushNotifications();
  const queryClient = useQueryClient();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (expoPushToken || notification) {
      queryClient.invalidateQueries({queryKey: ['unreadNoti']});
    }
  }, [expoPushToken, notification, queryClient]);

  // Xử lý trạng thái của ứng dụng. Khi quay lại ứng dụng sẽ tự động refetch lại unreadNoti
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        refetchUnreadNoti();
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, [refetchUnreadNoti]);

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
      <Stack.Protected guard={userInfo?.role === 'admin'}>
        <Tabs.Screen
          name="users"
          options={{
            title: 'Người dùng',
            tabBarIcon: ({color}) => <IconSymbol size={28} name="person.3.fill" color={color} />,
            tabBarActiveTintColor: COLOR.PRIMARY,
          }}
        />
      </Stack.Protected>
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({color}) => (
            <View style={{position: 'relative'}}>
              <IconSymbol size={28} name="bell.fill" color={color} />
              {userInfo && unreadNoti?.unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}>
                  <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>
                    {unreadNoti.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
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
