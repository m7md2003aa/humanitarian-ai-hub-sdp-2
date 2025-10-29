import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../state/authStore';

// Landing & Guest Screens
import LandingScreen from '../screens/auth/LandingScreen';
import GuestHome from '../screens/guest/GuestHome';

// Donor Screens
import DonorDashboard from '../screens/donor/DonorDashboard';
import DonationUpload from '../screens/donor/DonationUpload';
import DonationHistory from '../screens/donor/DonationHistory';

// Beneficiary Screens
import BeneficiaryDashboard from '../screens/beneficiary/BeneficiaryDashboard';
import ItemBrowser from '../screens/beneficiary/ItemBrowser';
import CreditHistory from '../screens/beneficiary/CreditHistory';

// Business Screens
import BusinessDashboard from '../screens/business/BusinessDashboard';
import ItemUpload from '../screens/business/ItemUpload';
import BusinessMarketplace from '../screens/business/BusinessMarketplace';
import PurchaseItem from '../screens/business/PurchaseItem';
import PurchaseSuccess from '../screens/business/PurchaseSuccess';

// Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import ItemVerification from '../screens/admin/ItemVerification';
import UserManagement from '../screens/admin/UserManagement';
import CreditManagement from '../screens/admin/CreditManagement';
import Analytics from '../screens/admin/Analytics';
import ManageDonations from '../screens/admin/ManageDonations';

// Shared Screens
import ProfileScreen from '../screens/shared/ProfileScreen';
import NotificationScreen from '../screens/shared/NotificationScreen';
import PrivacyScreen from '../screens/shared/PrivacyScreen';
import LanguageScreen from '../screens/shared/LanguageScreen';
import HelpCenterScreen from '../screens/shared/HelpCenterScreen';
import AboutScreen from '../screens/shared/AboutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DonorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DonorDashboard} />
      <Tab.Screen name="Upload" component={DonationUpload} />
      <Tab.Screen name="History" component={DonationHistory} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function BeneficiaryTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Browse') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Credits') {
            iconName = focused ? 'card' : 'card-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={BeneficiaryDashboard} />
      <Tab.Screen name="Browse" component={ItemBrowser} />
      <Tab.Screen name="Credits" component={CreditHistory} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function BusinessTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Marketplace') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={BusinessDashboard} />
      <Tab.Screen name="Marketplace" component={BusinessMarketplace} />
      <Tab.Screen name="Upload" component={ItemUpload} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Verify') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#EF4444',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Verify" component={ItemVerification} />
      <Tab.Screen name="Users" component={UserManagement} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function LandingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="GuestHome" component={GuestHome} />
    </Stack.Navigator>
  );
}

function AppStack() {
  const user = useAuthStore(state => state.user);
  
  const getRoleBasedTabs = () => {
    switch (user?.role) {
      case 'donor':
        return DonorTabs;
      case 'beneficiary':
        return BeneficiaryTabs;
      case 'business':
        return BusinessTabs;
      case 'admin':
        return AdminTabs;
      default:
        return DonorTabs;
    }
  };
  
  const TabComponent = getRoleBasedTabs();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={TabComponent} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationScreen}
        options={{ 
          title: 'Notifications',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="CreditManagement"
        component={CreditManagement}
        options={{
          title: 'Credit Management',
          presentation: 'card'
        }}
      />
      <Stack.Screen
        name="Analytics"
        component={Analytics}
        options={{
          title: 'Analytics',
          presentation: 'card'
        }}
      />
      <Stack.Screen
        name="ManageDonations"
        component={ManageDonations}
        options={{
          title: 'Manage Donations',
          presentation: 'card'
        }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{
          title: 'Privacy',
          presentation: 'card'
        }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{
          title: 'Language',
          presentation: 'card'
        }}
      />
      <Stack.Screen
        name="HelpCenter"
        component={HelpCenterScreen}
        options={{
          title: 'Help Center',
          presentation: 'card'
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About',
          presentation: 'card'
        }}
      />
      <Stack.Screen
        name="PurchaseItem"
        component={PurchaseItem}
        options={{
          title: 'Purchase Item',
          presentation: 'card'
        }}
      />
      <Stack.Screen
        name="PurchaseSuccess"
        component={PurchaseSuccess}
        options={{
          title: 'Purchase Success',
          presentation: 'card',
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <LandingStack />}
    </NavigationContainer>
  );
}