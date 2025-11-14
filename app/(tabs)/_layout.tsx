import { Tabs } from 'expo-router';
import { Users, FileText } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1976D2',
        tabBarInactiveTintColor: '#757575',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pacientes',
          tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="prescription/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="monitoring/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="patient-form"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
