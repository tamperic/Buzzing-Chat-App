import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ImageBackground,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
  } from "react-native";
  import { useState } from "react";
  import Feather from "@expo/vector-icons/Feather";
  import { signInAnonymously } from "firebase/auth";
  import { auth } from "../firebase.config";
  
  const backgroundImage = require("../assets/BackgroundImage.png");
  
  const Start = ({ navigation }) => {
    const [name, setName] = useState("");
    const [bgColor, setBgColor] = useState("#474056");
    const circles = ["#474056", "#8A95A5", "#B9C6AE", "#090C08"];
    const borders = ["#796c94", "#59616b", "#7a856f", "#6b6b6a"];
  
    const signInUser = () => {
      signInAnonymously(auth)
        .then((result) => {
          navigation.navigate("Chat", {
            name: name,
            backgroundColor: bgColor,
            userID: result.user.uid,
          });
          Alert.alert("Successfully signed in!");
        })
        .catch((error) => {
          Alert.alert("Unable to sign in, try again later.");
        });
    };
  

    return (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground source={backgroundImage} style={styles.image}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={styles.title}>
                        Buzzin<Text style={{ opacity: 0.5 }}>g</Text>
                        </Text>
            
                        <View style={styles.box}>
                            <View style={styles.inputBox}>
                                <Feather name="user" size={24} color="black" style={styles.UserIcon} />
                                <TextInput
                                style={styles.textInput}
                                value={name}
                                placeholder="Your name"
                                onChangeText={setName}
                                />
                            </View>
                
                            <Text style={styles.textBgColor}>Choose Background Color:</Text>
                
                            <View style={styles.circlesBox}>
                                {circles.map((circle, index) => {
                                const isSelected = bgColor === circle;
                                return (
                                    <TouchableOpacity
                                    key={circle}
                                    style={[
                                        styles.circles,
                                        styles.borders,
                                        {
                                        backgroundColor: circle,
                                        borderColor: isSelected ? borders[index] : "transparent",
                                        },
                                    ]}
                                    onPress={() => setBgColor(circle)}
                                    />
                                );
                                })}
                            </View>
            
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                if (name === "") {
                                    Alert.alert("Please enter your username to start to chat");
                                } else {
                                    signInUser();
                                }
                                }}
                            >
                                <Text style={styles.btnText}>Let's Chat!</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      );
  };
  

const styles = StyleSheet.create({
    // Background
    container: {
        flex: 1,
        alignItems: 'center'
    },
    innerContent: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 200
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        flex: 1
    },
    // Title
    title: {
        paddingVertical: 60,
        marginBottom: 160,
        textAlign: 'center',
        fontSize: 45,
        fontWeight: '600',
        color: '#fff'
    },
    // White box
    box: {
        backgroundColor: '#fff',
        width: '88%',
        borderRadius: 3,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    // inputBox = icon + text
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
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
        fontWeight: '300'
    },
    // Choose color part of the white box
    textBgColor: {
        marginBottom: 20,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        textAlign: 'center'
    },
    circlesBox: {
        flexDirection: 'row',
        marginBottom: 20,
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
        fontWeight: '600', 
        fontSize: 16
    }
});

export default Start;