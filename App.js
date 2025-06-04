// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create navigator
const Stack = createNativeStackNavigator();

import { db } from './firebase.config';

import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { disableNetwork, enableNetwork } from 'firebase/firestore';


export default function App() {
  // Use 'useNetInfo' determine whether a user is online or not.
  const connectionStatus = useNetInfo();

  // Display an alert popup if connection is lost. 
  // In Android, Firebase will keep attempting to reconnect to the Firestore Database. These attempts can be disabled by calling the Firestore function 'disableNetwork(db)' when '.isConnected'' is false '. To re-enable, call another Firestore function 'enableNetwork(db)' when '.isConnected' is 'true'.
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection lost!');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start}/>
        <Stack.Screen name='Chat'>
          {props => <Chat db={db} isConnected={connectionStatus.isConnected} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}