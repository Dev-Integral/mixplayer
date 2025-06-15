import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {  faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const Contact = ({ setCurrentKey }) => {
  return (
    <View style={styles.container}>
      <Pressable 
        onPress={() => setCurrentKey('home')} 
        style={styles.backButton}
      >
        <FontAwesomeIcon icon={faChevronLeft} size={24} color="white" />
        
        <Text style={styles.backText}>Back</Text>
                

      </Pressable>
    </View>
  );
};

export default Contact;

// ... your styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    justifyContent: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  backText: {
    color: 'white',
    fontSize: 18,
  },
  content: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  linkText: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
