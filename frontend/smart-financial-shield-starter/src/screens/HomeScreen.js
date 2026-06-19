import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SMART FINANCIAL SHIELD</Text>
      <Text style={styles.subtitle}>Your AI-powered finance companion</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' },
  title: { fontSize: 20, fontWeight: '700', color: colors.dark, marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280' },
});
