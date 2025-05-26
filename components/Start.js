import { StyleSheet, View, Text, TouchableOpacity, TextInput, ImageBackground, Image } from "react-native";
import { useState } from "react";
import Feather from '@expo/vector-icons/Feather';

const backgroundImage = require("../assets/BackgroundImage.png");


const Start = ({ navigation }) => {
    const [ name, setName ] = useState('');

    const [ bgColor, setBgColor ] = useState('#474056');
    const circles = [  '#474056', '#8A95A5', '#B9C6AE', '#090C08' ];
    const borders = ['#796c94', '#59616b', '#7a856f', '#6b6b6a'];

    return (
        <View style={styles.container}>
            <ImageBackground resizeMode="cover" source={backgroundImage} style={styles.image}>
                <Text style={styles.title}>Buzzin<Text style={{ opacity: 0.5 }}>g</Text></Text>
                <View style={styles.box}>
                    <TextInput 
                        style={styles.textInput}
                        value={name}
                        placeholder="Your name"
                        onChangeText={setName}
                    />
                    <Text style={styles.textBgColor}>Choose Background Color:</Text>
                        <Feather name="user" size={24} color="black" style={styles.UserIcon} />
                    <View style={styles.circlesBox}>
                        {circles.map((circle, index) => {
                            // Used 'index' from 'map' to access the corresponding border color from the borders array.
                            const isSelected = bgColor === circle;
                            return (
                            <TouchableOpacity 
                                key={ circle } 
                                style={[ styles.circles, styles.borders, { backgroundColor: circle, borderColor: isSelected ? borders[index] : 'transparent' } ]} // Only apply the 'borderColor' if the current circle is selected. Otherwise, make it transparent (or same as background for invisibility).
                                onPress={() => setBgColor(circle)} 
                            />
                        )} )}
                    </View>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat', { name: name, backgroundColor: bgColor })}>
                        <Text style={styles.btnText}>Let's Chat!</Text>
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