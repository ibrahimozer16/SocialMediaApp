import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { Provider } from 'react-redux';
import store from './redux/store'
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ExploreScreen from './screens/ExploreScreen';
import ProfileScreen from './screens/ProfileScreen';
import StoryScreen from './screens/StoryScreen';
import CreatePost from './screens/CreatePost';
import CreateStory from './screens/CreateStory';
import NotificationScreen from './screens/NotificationScreen';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import EditProfile from './screens/EditProfile';
import Settings from './screens/Settings';
import PostDetails from './screens/PostDetails';
import UserProfileScreen from './screens/UserProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName : keyof typeof Ionicons.glyphMap | undefined;
  
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Notification') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'Explore') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } 
  
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    >
      <Tab.Screen name='Home' component={HomeScreen}/>
      <Tab.Screen name='Notification' component={NotificationScreen}/>
      <Tab.Screen name='Explore' component={ExploreScreen}/>
      <Tab.Screen name='Profile' component={ProfileScreen}/>
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen}/>
          <Stack.Screen options={{headerShown: false}} name="Main" component={MainTabNavigator}/>
          <Stack.Screen name="CreatePost" component={CreatePost}/>
          <Stack.Screen name="CreateStory" component={CreateStory}/>
          <Stack.Screen options={{headerShown: false}} name="Story" component={StoryScreen}/>
          <Stack.Screen options={{headerShown: false}} name="Edit" component={EditProfile}/>
          <Stack.Screen options={{headerShown: false}} name="Settings" component={Settings}/>
          <Stack.Screen options={{headerShown: false}} name="PostDetails" component={PostDetails}/>
          <Stack.Screen options={{headerShown: false}} name="UserProfile" component={UserProfileScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

