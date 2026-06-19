import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [biometric, setBiometric] = React.useState(false);

  const SettingsSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ icon, label, value, onPress, showToggle = false }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      {showToggle ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#d1d5db', true: colors.primary }}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john@example.com</Text>
          </View>
        </View>
      </View>

      <SettingsSection title="Account">
        <SettingsItem
          icon="person"
          label="Profile"
          onPress={() => alert('Profile Settings')}
        />
        <SettingsItem
          icon="lock-closed"
          label="Change Password"
          onPress={() => alert('Change Password')}
        />
        <SettingsItem
          icon="card"
          label="Payment Methods"
          onPress={() => alert('Payment Methods')}
        />
      </SettingsSection>

      <SettingsSection title="Security">
        <SettingsItem
          icon="notifications"
          label="Notifications"
          value={notifications}
          onPress={() => setNotifications(!notifications)}
          showToggle
        />
        <SettingsItem
          icon="finger-print"
          label="Biometric Login"
          value={biometric}
          onPress={() => setBiometric(!biometric)}
          showToggle
        />
        <SettingsItem
          icon="shield-checkmark"
          label="Two-Factor Authentication"
          onPress={() => alert('2FA Settings')}
        />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingsItem
          icon="color-palette"
          label="Theme"
          onPress={() => alert('Theme Settings')}
        />
        <SettingsItem
          icon="language"
          label="Language"
          onPress={() => alert('Language Settings')}
        />
        <SettingsItem
          icon="document-text"
          label="Currency"
          onPress={() => alert('Currency Settings')}
        />
      </SettingsSection>

      <SettingsSection title="General">
        <SettingsItem
          icon="help-circle"
          label="Help & Support"
          onPress={() => alert('Help & Support')}
        />
        <SettingsItem
          icon="document"
          label="Terms & Privacy"
          onPress={() => alert('Terms & Privacy')}
        />
        <SettingsItem
          icon="information-circle"
          label="About"
          onPress={() => alert('About App v1.0.0')}
        />
      </SettingsSection>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out" size={24} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Smart Financial Shield v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  profileEmail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 16,
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginVertical: 24,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 12,
  },
});
