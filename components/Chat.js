import { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Send, Bubble, GiftedChat, InputToolbar, Composer, SystemMessage, Day } from "react-native-gifted-chat"; // Import Gifted Chat library
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // A persistent key-value storage mechanism in which can strings be stored.


const Chat = ({ route, navigation, db, isConnected }) => {
    const [ messages, setMessages ] = useState([]);
    const { name, backgroundColor, userID } = route.params;
    
    const onSend = (newMessages) => {
        // Update 'onSend' function to save sent messages on the Firestore database.
        addDoc(collection(db, 'messages'), newMessages[0]); // Use the 'addDoc()' Firestore function to save the passed message to the function in the database.
    };
        

    // Cache all messages whenever they’re updated. 
    const cacheMessages = async (messagesToCache) => {
        try {
            // Convert objects and arrays into strings to store them in 'AsyncStorage'.
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.messages);
        }
    }

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }


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
                    newMessages.push({id: docObject.id, ...docObject.data(), createdAt: docObject.data().createdAt.toDate() });
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
                <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginBottom: 5, marginLeft: 8 }}>
                    <FontAwesome name="send" size={22} color="#fff" />
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
 

    return (
        <View style={[ styles.container, { backgroundColor }]} >
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID, // '_id' property has the value of the (user ID) route parameter passed from the Start screen when logged in anonymously.
                    name: name // 'name' property has the value of the name route parameter passed from Start screen when logged in anonymously.
                }}
                renderInputToolbar={renderInputToolbar} 
                renderSend={renderSend}
                renderComposer={renderComposer}
                renderSystemMessage={renderSystemMessage}
                renderDay={renderDay}
                alwaysShowSend={true}
            />
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
            { Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-211} /> : null }
           
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
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
        borderTopWidth: 0
    },
    Composer: {
        backgroundColor: '#fff',
        color: '#000',
        paddingHorizontal: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginVertical: 10,
        borderRadius: 20,
        minHeight: 40,
        maxHeight: 120,
        flex: 1,
    }
});

export default Chat;