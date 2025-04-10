import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const PrivacyScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>

      <Text style={styles.text}>
        We respect your privacy. Lively collects minimal data to provide the best user experience.
      </Text>

      <Text style={styles.subHeader}>Data We Collect:</Text>
      <Text style={styles.text}>
        - Event Information (title, location, date, time, description){'\n'}
        - Your City and Location (to display events near you){'\n'}
        - Photos you upload (for event images){'\n'}
        - Optional Contact Info (email and phone number)
      </Text>

      <Text style={styles.subHeader}>How We Use Your Data:</Text>
      <Text style={styles.text}>
        - To display your event to other users.{'\n'}
        - To show events based on your city or location.{'\n'}
        - To contact you if there are any issues with your event submission.{'\n'}
        - We do not sell or share your personal data with third parties.
      </Text>

      <Text style={styles.subHeader}>Permissions:</Text>
      <Text style={styles.text}>
        - Location access is used only to show events in your area.{'\n'}
        - Photo access is used only for event image uploads.
      </Text>

      <Text style={styles.text}>
        By using this app, you agree to this privacy policy.
      </Text>
      <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 12, color: 'gray' }}>
          © 2025 Lively
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 85,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
});

export default PrivacyScreen;