import { StyleSheet, View, Text, TouchableOpacity, TextInput, ImageBackground, Alert } from "react-native";
import { useState } from "react";
import Feather from '@expo/vector-icons/Feather';
import { getAuth, signInAnonymously } from "firebase/auth";

const backgroundImage = require("../assets/BackgroundImage.png");


const Start = ({ navigation }) => {
    const auth = getAuth(); // 'getAuth()' returns the authentication handle of Firebase.
    
    const [ name, setName ] = useState('');

    const [ bgColor, setBgColor ] = useState('#474056');
    const circles = [  '#474056', '#8A95A5', '#B9C6AE', '#090C08' ];
    const borders = ['#796c94', '#59616b', '#7a856f', '#6b6b6a'];

    const signInUser = () => {
        // 'signInAnonymously()' allows the user to sign in anonymously. It returns a promise, which means that can attach .then() and .catch() to it.
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate("Chat", { name: name, backgroundColor: bgColor, userID: result.user.uid}); // Once the user is signed in, the app navigates to the 'Chat' screen while passing 'result.user.uid' (which is assigned to the route parameter 'userID'). This user ID will be used to personalize the chat your users view and add to the 'Chat' screen.
                Alert.alert('Successfully signed in!');
            }) //  Also, get an information object (represented by 'result' in the code example) regarding the temporary user account. 
            .catch((error) => {
                Alert.alert('Unable to sign in, try again later.');
            })
    };

    return (
        <View style={styles.container}>
            <ImageBackground resizeMode="cover" source={backgroundImage} style={styles.image}>
                <Text style={styles.title}
                    accessibilityLabel='Buzzing'
                    accessibilityHint='The name of application'
                    accessibilityRole='header' 
                >Buzzin<Text style={{ opacity: 0.5 }}>g</Text>
                </Text>
                <View style={styles.box}>
                    <View style={styles.inputBox}>
                        <Feather name="user" size={24} color="black" style={styles.UserIcon} />
                        <TextInput 
                            style={styles.textInput}
                            value={name}
                            placeholder="Your name"
                            onChangeText={setName}
                            accessibilityLabel='Input field'
                            accessibilityHint='Enter your name to start to chat'
                        />
                    </View>
                    <Text style={styles.textBgColor} 
                        accessibilityLabel='Choose background color'
                        accessibilityRole='text' 
                    >Choose Background Color:
                    </Text>
                    <View style={styles.circlesBox}>
                        {circles.map((circle, index) => {
                            // Used 'index' from 'map' to access the corresponding border color from the borders array.
                            const isSelected = bgColor === circle;
                            return (
                                <TouchableOpacity 
                                    key={ circle } 
                                    style={[ styles.circles, styles.borders, { backgroundColor: circle, borderColor: isSelected ? borders[index] : 'transparent' } ]} // Only apply the 'borderColor' if the current circle is selected. Otherwise, make it transparent (or same as background for invisibility).
                                    onPress={() => setBgColor(circle)}
                                    accessibilityLabel='Choose the background color for your chat screen ${circle}' 
                                    accessibilityRole='button'
                                />
                            )
                        })}
                    </View>
                    <TouchableOpacity style={styles.button} 
                        onPress={signInUser}
                        accessible={true}
                        accessibilityLabel='Open the chat' 
                        accessibilityHint='Press the button to open the chat'
                        accessibilityRole='button'
                    >
                        <Text style={styles.btnText} 
                        >Let's Chat!
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    // Background
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'space-between'
    },

    // Title
    title: {
        marginTop: 100,
        textAlign: 'center',
        fontSize: 45,
        fontWeight: 600,
        color: '#fff'
    },

    // White box
    box: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 80,
        backgroundColor: '#fff',
        width: '88%',
        height: '44%',
        borderRadius: 3,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    // inputBox = icon + text
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 1,
        padding: 15,
        width: '88%',
        borderRadius: 5,
        // shadowColor: 'black',
        // shadowOpacity: 0.8,
        // shadowOffset: {width: 1, height: 1},
        // shadowRadius: 1
    },
    UserIcon: {
        width: 20,
        height: 20,
        marginRight: 15,
        opacity: 0.7
    },
    textInput: {
        fontSize: 16,
        fontWeight: 300
    },
    // Choose color part of the white box
    textBgColor: {
        marginBottom: -20,
        width: '88%',
        height: 20,
        fontSize: 16,
        fontWeight: 300,
        color: '#757083',
        textAlign: 'center'
    },
    circlesBox: {
        flexDirection: 'row', 
        width: '88%', 
        justifyContent: 'space-evenly' 
    },
    circles: {
        borderRadius: 25,
        width: 50,
        height: 50
    },
    borders: {
        borderWidth: 4
    },
    // "Let's chat" button
    button: {
        marginBottom: 20,
        width: '88%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#757083'
    },
    btnText: { 
        color: '#FFFFFF', 
        fontWeight: 600, 
        fontSize: 16
    }
});

export default Start;