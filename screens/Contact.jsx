import {
  View,
  Text,
  Pressable,
  Linking,
  StyleSheet,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {  faChevronLeft,  } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

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
      <View style={styles.content}>
        <Text style={styles.header}>Connect With Us</Text>

        <Pressable
          onPress={() => Linking.openURL("https://www.facebook.com/profile.php?id=61576241979899")}
          style={styles.linkButton}
        >
          <FontAwesomeIcon icon={faFacebook} size={24} color="#3b5998" />
          <Text style={styles.linkText}>Follow us on Facebook</Text>
        </Pressable>

        <Pressable
          onPress={() => Linking.openURL("https://wa.me/447886235979")}
          style={styles.linkButton}
        >
          <FontAwesomeIcon icon={faWhatsapp} size={24} color="#25D366" />
          <Text style={styles.linkText}>Connect with us on WhatsApp</Text>
        </Pressable>

        <Pressable
          onPress={() => Linking.openURL("https://radio-o.co.uk/support-us")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Support Us</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Contact;

// ... your styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    padding: 20,
    justifyContent: "flex-start",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  backText: {
    color: "white",
    fontSize: 18,
  },
  content: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 8,
  },
  linkText: {
    color: "#1e90ff",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});

