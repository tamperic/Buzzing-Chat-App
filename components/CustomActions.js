import * as ImagePicker from 'expo-image-picker'; // Import everything from the expo-image-picker package
import * as Location from 'expo-location';
import { Alert, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet'; // Fetch Gifted Chat's 'ActionSheet' so that you can add ('onActionPress') options to it.

// Import 'uploadBytes' function used to upload the file
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
   const actionSheet = useActionSheet();


    // Function to display a menu containing options such as taking a photo, selecting a photo, or sharing a location. 
    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                    default:
                }
            },
        );
    };


    // Function to upload images to Firebase
    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString); // The reference string that can be used as an identifier to retrieve/download the file once it’s uploaded.
        const response = await fetch(imageURI);
        const blob = await response.blob(); // Blob of the image file the user wants to upload.
        
        // Upload an image file blob using the Firebase Storage method 'uploadBytes()'
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            // Send image as a message rendered in bubble inside 'GiftedChat'.
            const imageURL = await getDownloadURL(snapshot.ref); // Get remote URL of the just uploaded image.
            
            onSend([
                {
                    _id: `${userID}-${new Date().getTime()}`, 
                    createdAt: new Date(),
                    user: {
                    _id: userID,
                    name: '',
                    },
                    image: imageURL,
              }
            ]);
        });
    };


    // Function to upload multiple images using unique reference string each time a new file is uploaded
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime(); // Get current timestamp
        const imageName = uri.split("/")[uri.split("/").length - 1]; // Get original image file name
        return `${userID}-${timeStamp}-${imageName}`; // Create unique reference string based on user's ID, timestamp and image name
    }


    const pickImage =  async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Permission to access the media library.
        
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync(); // Opens the device’s media library to let the user choose a file.
            
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert('Permission not granted');
        }
    }

    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync(); // Permission to access the camera.
        
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync(); // Opens the device’s camera and allows the user to take a photo.
            
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri); 
            else Alert.alert('Permission not granted ');
        }
    }


    const getLocation = async () => {
        const permissions  = await Location.requestForegroundPermissionsAsync();
      
        if (permissions?.granted) {
            try {
                const location = await Location.getCurrentPositionAsync({});
        
                if (location) {
                    onSend([
                        {
                            _id: `${userID}-${new Date().getTime()}`,
                            createdAt: new Date(),
                            user: {
                            _id: userID,
                            },
                            location: {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            },
                        }
                    ]);
                } else {
                Alert.alert('Could not fetch location.');
                }
            } catch (err) {
                Alert.alert('An error occurred while fetching location.');
            }
        } else {
          Alert.alert('Permission to access location was denied.');
        }
    };
      


    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={onActionPress}
            accessibilityLabel='Import multimedia files'
            accessibilityHint='Allows to take a photo, pick an image, or send a location, and send them as a message'
            accessibilityRole='button'
        >
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create ({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1
    },
    iconText: {
        color: '#b2b2b2',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'transparent'
    }
});

export default CustomActions;