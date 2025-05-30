// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


export default function App() {
  // Web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCD7EuAjk65S_nOljR7Kda_t7BbMANco9s",
    authDomain: "buzzing-chat-app.firebaseapp.com",
    projectId: "buzzing-chat-app",
    storageBucket: "buzzing-chat-app.firebasestorage.app",
    messagingSenderId: "382017358182",
    appId: "1:382017358182:web:43b93880912d88d76aa0a7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  
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