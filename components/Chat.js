import { useEffect, useState } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Send, Bubble, GiftedChat, InputToolbar, Composer, SystemMessage, Day } from "react-native-gifted-chat"; // Import Gifted Chat library
import FontAwesome from '@expo/vector-icons/FontAwesome';


const Chat = ({ route, navigation }) => {
    const [ messages, setMessages ] = useState([]);
    const { name, backgroundColor } = route.params;
    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    } // 'onSend' gets called with the new message; adds new message it to the existing list of messages using '.append'. The 'message' state updates, cousing the chat UI to re-render and show the new message.
    
    useEffect(() => {
        navigation.setOptions({ title: name });

        setMessages([
            // System default message when user opens the chat
            {
                _id: 2,
                text: 'You have entered the chat',
                createdAt: new Date(),
                system: true,
            },
            // Default bubble message when user opens the chat
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ]);
    }, []); // 'useEffect()' function gets called right after the Chat component mounts and sets up an initial default message in the chat (A message saying "Hello developer" from a user named "React Native" with an avatar.)


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
        return <InputToolbar 
            {...props}
            containerStyle={styles.InputToolbar}
            accessibilityLabel='Input field'
            accessibilityHint='Type something to send a message'
            accessibilityRole='text' 
        />
    }

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
        );
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
        <View style={[ styles.container, { backgroundColor }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                    name
                }}
                renderInputToolbar={renderInputToolbar} 
                renderSend={renderSend}
                renderComposer={renderComposer}
                renderSystemMessage={renderSystemMessage}
                renderDay={renderDay}
                alwaysShowSend={true}
            />
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
            { Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-211} /> : null } 
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