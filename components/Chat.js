import { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";


const Chat = ({ route, navigation }) => {
    const { name, backgroundColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);
     
    return (
        <View style={[ styles.container, { backgroundColor }]}>
            <Text style={[styles.text, { fontSize: 36 }]}>Hi {name}! 👋🏼</Text>
            <Text style={styles.text}>Welcome to Buzzin<Text style={{ opacity: 0.5 }}>g</Text> 💬 </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 26,
        fontWeight: 600,
        color: '#fff', 
        padding: 15
    }
});

export default Chat;