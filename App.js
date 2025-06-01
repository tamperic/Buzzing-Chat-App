// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create navigator
const Stack = createNativeStackNavigator();

import { db } from './firebase.config';



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start}/>
        <Stack.Screen name='Chat'>
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}