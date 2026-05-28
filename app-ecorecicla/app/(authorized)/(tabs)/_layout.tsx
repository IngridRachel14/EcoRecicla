import { TabBar } from '@/components/TabBar';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: 'QR',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
