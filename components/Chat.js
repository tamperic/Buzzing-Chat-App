import CustomActions from "./CustomActions";
import { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Send, Bubble, GiftedChat, InputToolbar, Composer, SystemMessage, Day } from "react-native-gifted-chat"; // Import Gifted Chat library
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // A persistent key-value storage mechanism in which can strings be stored.
import MapView from 'react-native-maps';
import { getBottomSpace } from "react-native-iphone-screen-helper";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
    const [ messages, setMessages ] = useState([]);
    const { name, backgroundColor, userID } = route.params;


    let unsubMessages;// Declare the 'unsubMessages' variable outside the 'useEffect()' to not to lose the reference to the old unsubscribe function. 
    // This is because re-initializing any kind of listener doesn’t override and remove the old listener, it only removes the reference to that old listener, while keeping it alive somewhere in the memory without a way of reaching it, resulting in a memory leak.

    // 'onSnapshot()' takes a “snapshot” of your collection and its documents at the precise moment that it’s called.
    useEffect(() => {
        navigation.setOptions({ title: name });

        if (isConnected === true) {
            // Unregister current 'onSnapshot()' listener to avoid registering multiple listeners when 'useEffect' code is re-executed.
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            // code to execute when component mounted or updated
            const q = query(collection(db, "messages"), orderBy('createdAt', 'desc'));
            unsubMessages = onSnapshot(q, async (documentsSnapshot) => {
                let newMessages = []; // An empty array (newMessages) is created, which will be filled later in the 'forEach()' loop.
                documentsSnapshot.forEach(docObject => {
                    newMessages.push({id: docObject.id, ...docObject.data(), createdAt: new Date(docObject.data().createdAt.toMillis()) });
                }); // First the document id found in the '.id' property of each object within this complex object. The actual document properties can be extracted with the '.data()' function of each object in 'messages'. And the TimeStamp stored at the 'createdAt' property of each message is converted to a Date object that Gifted Chat understands.
                cacheMessages(newMessages);
                setMessages(newMessages); // Use the state setter function 'setMessages' to assign the new array to 'messages' state.
            });
        } else loadCachedMessages();

        // Clean up code (returned function) by calling the unsubsrcibe function of 'onSnapshot()'
        return () => {
            // code to execute when the component will be unmounted
            if (unsubMessages) unsubMessages(); // An 'if' statement has been added to check if the 'unsubMessages' isn't undefined. This is a protection procedure just in case the 'onSnapshot()' function call fails.
        }
    }, [isConnected]); // Allow the component to call the callback of 'useEffect' whenever the 'isConnected' prop’s value changes.
        

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }


    // Cache all messages whenever they’re updated. 
    const cacheMessages = async (messagesToCache) => {
        try {
            // Convert objects and arrays into strings to store them in 'AsyncStorage'.
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.messages);
        }
    }

    const onSend = (newMessages = []) => {
        // Update 'onSend' function to save sent messages on the Firestore database.
        setMessages(GiftedChat.append(messages, newMessages));
        newMessages.forEach(message => {
          addDoc(collection(db, "messages"), message);
        });
    };

    const renderBubble = (props) => {
        return <Bubble 
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#000', // Sender
                    padding: 5
                },
                left: {
                    backgroundColor: '#fff', // Receiver
                    padding: 5
                }
            }}
            accessibilityLabel='Chat bubble'
            accessibilityHint='Contains message'
            accessibilityRole='text' 
        />
    }
    
    const renderInputToolbar = (props) => {
        if (!isConnected) return null;
      
        return (
          <InputToolbar
            {...props}
            containerStyle={styles.InputToolbar}
            accessibilityLabel="Input field"
            accessibilityHint="Type something to send a message"
            accessibilityRole="text"
          />
        );
    };

    const renderSend = (props) => {
        return (
            <Send
                {...props}
                accessibilityLabel='Send icon button'
                accessibilityHint='Press the icon button to send a message'
                accessibilityRole='button' 
            >
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 25, marginBottom: 10, marginLeft: 8 }}>
                    <FontAwesome name="send" size={22} color="#828282" />
                </View>
            </Send>
        )
    }

    const renderComposer = (props) => {
        return (
            <Composer
                {...props}
                textInputStyle={styles.Composer}
                placeholderTextColor="#999"
            />
        );
    }
      
    const renderDay = (props) => {
        return (
            <Day 
                {...props}
                textStyle={{
                    color: '#fff',
                    opacity: 0.9, 
                    fontWeight: '600',
                }}
                accessibilityLabel='Current date'
                accessibilityRole='text'
            />
        )
    }

    const renderSystemMessage = (props) => {
        return (
            <SystemMessage 
                {...props}
                containerStyle={{ marginBottom: 20 }}
                textStyle={{
                    color: '#fff',
                    opacity: 0.9, 
                    fontWeight: '600',
                }}
                accessibilityLabel='System message'
                accessibilityRole='text'
            />
        )
    }

    // Function responsible for creating the circle button
    const renderCustomActions = (props) => {
        return <CustomActions 
            userID={userID}
            storage={storage}  // Pass the 'storage' to 'CustomActions' so that it can be used in the location.
            onSend={onSend}
            {...props} 
        />;
    }

    // Check if the 'currentMessage' contains location data.
    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView 
                    style={{ 
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                />
            );
        }
        return null;
    }

    return (
        <View style={[ styles.container, { backgroundColor }]} >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === 'ios' ? getBottomSpace() - 195 : 0}
            >
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID, // '_id' property has the value of the (user ID) route parameter passed from the Start screen when logged in anonymously.
                    name: name // 'name' property has the value of the name route parameter passed from Start screen when logged in anonymously.
                }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar} 
                renderSend={renderSend}
                renderComposer={renderComposer}
                renderSystemMessage={renderSystemMessage}
                renderDay={renderDay}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                alwaysShowSend={true}
            />
            </KeyboardAvoidingView>
            {/* { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
            { Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-211} /> : null }  */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1   // Allow the view to expand to 100 percent of the screen.
    },
    InputToolbar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingVertical: 3,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderTopWidth: 0
    },
    Composer: {
        backgroundColor: '#fff',
        color: '#000',
        borderColor: 'grey',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginVertical: 10,
        borderRadius: 20,
        minHeight: 40,
        maxHeight: 120,
        flex: 1
    }
});

export default Chat;