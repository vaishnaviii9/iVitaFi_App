import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8fafc', // Soft background for aesthetic
    },
    doctorImage: {
      width: width * 0.9, // Set width to 90% of screen width
      height: undefined, // Maintain aspect ratio
      aspectRatio: 1, // Ensure proper scaling
      resizeMode: 'contain', // Keep the image contained
      marginBottom: -90, // Move closer to the logo
    },
    landingImage: {
      width: width * 0.8, // Set the width to 80% of the screen width
      height: undefined, // Let the height adjust based on the aspect ratio
      aspectRatio: 1, // Match your image's aspect ratio
      marginBottom: 1, // Slightly reduced spacing for tighter grouping
      resizeMode: 'contain', // Ensure the entire image is visible
    },
    buttonContainer: {
      marginTop: -60, // Shifted up closer to the images
      alignItems: 'center',
    },
    continueButton: {
      backgroundColor: '#1F3644',
      borderRadius: 15,
      paddingVertical: 15,
      paddingHorizontal: 100,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 7, // For Android shadow effect
    },
    continueText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: '600',
    },
    footerText: {
      marginTop: 30, // Reduced spacing below the button
      fontSize: 14,
      color: '#6c757d',
      textAlign: 'center',
    },
  });
   
 

export default styles;
