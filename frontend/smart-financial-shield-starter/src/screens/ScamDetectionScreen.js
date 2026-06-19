import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { colors } from '../constants/colors';

export default function ScamDetectionScreen() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async () => {
    if (!text.trim()) {
      Alert.alert('Please enter a message to analyze');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        'https://your-api-gateway-url/risk',
        { text }
      );
      setResult(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Analysis failed', err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scam Detection</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Paste message here..."
        value={text}
        onChangeText={setText}
        editable={!loading}
      />
      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Analyze</Text>}
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Result</Text>
          <Text>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: colors.dark },
  input: { minHeight: 120, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '600' },
  resultBox: { marginTop: 16, padding: 12, backgroundColor: '#f9fafb', borderRadius: 8 },
  resultTitle: { fontWeight: '700', marginBottom: 8 },
});
