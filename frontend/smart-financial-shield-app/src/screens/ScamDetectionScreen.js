import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { colors } from '../constants/colors';

export default function ScamDetectionScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  const analyzeMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please paste a message to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://your-api-gateway-url/risk",
        { text: message }
      );

      setResult(response.data);
      setAnalyzed(true);
    } catch (error) {
      Alert.alert(
        'Analysis Failed',
        error.message || 'Failed to analyze the message. Please try again.'
      );
      console.error('Scam detection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setMessage('');
    setResult(null);
    setAnalyzed(false);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return colors.primary;
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'alert-circle';
      case 'medium':
        return 'warning';
      case 'low':
        return 'checkmark-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="shield-checkmark" size={32} color="white" />
            <Text style={styles.headerTitle}>Scam Detection</Text>
            <Text style={styles.headerSubtitle}>
              Analyze messages for potential scams and fraud
            </Text>
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paste Message</Text>
          <Text style={styles.sectionDescription}>
            Copy and paste any message you suspect might be a scam
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Paste the message here..."
              placeholderTextColor="#d1d5db"
              multiline
              numberOfLines={6}
              value={message}
              onChangeText={setMessage}
              editable={!loading}
            />
          </View>

          <Text style={styles.charCount}>
            {message.length} / 5000 characters
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.analyzeButton, loading && styles.buttonDisabled]}
            onPress={analyzeMessage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="search" size={20} color="white" />
                <Text style={styles.analyzeButtonText}>Analyze</Text>
              </>
            )}
          </TouchableOpacity>

          {analyzed && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAnalysis}
              disabled={loading}
            >
              <Ionicons name="close" size={20} color={colors.primary} />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Results Section */}
        {analyzed && result && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultCard}>
              {/* Risk Level */}
              <View
                style={[
                  styles.riskLevel,
                  { borderLeftColor: getRiskColor(result.riskLevel) },
                ]}
              >
                <View style={styles.riskHeader}>
                  <Ionicons
                    name={getRiskIcon(result.riskLevel)}
                    size={28}
                    color={getRiskColor(result.riskLevel)}
                  />
                  <View style={styles.riskTextContainer}>
                    <Text style={styles.riskLabel}>Risk Level</Text>
                    <Text
                      style={[
                        styles.riskValue,
                        { color: getRiskColor(result.riskLevel) },
                      ]}
                    >
                      {result.riskLevel}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Confidence Score */}
              {result.confidence && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Confidence Score</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${result.confidence}%`,
                          backgroundColor: getRiskColor(result.riskLevel),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.confidenceText}>
                    {result.confidence}% confidence
                  </Text>
                </View>
              )}

              {/* Scam Type */}
              {result.scamType && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Scam Category</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{result.scamType}</Text>
                  </View>
                </View>
              )}

              {/* Red Flags */}
              {result.redFlags && result.redFlags.length > 0 && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Red Flags Detected</Text>
                  {result.redFlags.map((flag, index) => (
                    <View key={index} style={styles.flagItem}>
                      <Ionicons
                        name="alert-circle"
                        size={16}
                        color="#ef4444"
                      />
                      <Text style={styles.flagText}>{flag}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Analysis Summary */}
              {result.summary && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Analysis Summary</Text>
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryText}>{result.summary}</Text>
                  </View>
                </View>
              )}

              {/* Recommendation */}
              {result.recommendation && (
                <View style={styles.recommendationBox}>
                  <Ionicons name="bulb" size={24} color="#f59e0b" />
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>Recommendation</Text>
                    <Text style={styles.recommendationText}>
                      {result.recommendation}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsSectionTitle}>How to Spot Scams</Text>
          <View style={styles.tipsList}>
            <TipItem
              icon="alert"
              title="Urgent Pressure"
              description="Scammers create urgency to force quick decisions"
            />
            <TipItem
              icon="key"
              title="Requests for Money"
              description="Never send money to unknown or unverified sources"
            />
            <TipItem
              icon="shield-checkmark"
              title="Personal Info"
              description="Legitimate companies never ask for sensitive data via messages"
            />
            <TipItem
              icon="link"
              title="Suspicious Links"
              description="Hover over links to check the actual URL before clicking"
            />
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This tool provides AI-powered analysis for educational purposes. For
            confirmed scams, please report them to your local authorities or the
            relevant platform.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function TipItem({ icon, title, description }) {
  return (
    <View style={styles.tipItem}>
      <View style={styles.tipIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{title}</Text>
        <Text style={styles.tipDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    backgroundColor: 'white',
    overflow: 'hidden',
    marginBottom: 8,
  },
  textInput: {
    padding: 16,
    fontSize: 14,
    color: colors.dark,
    textAlignVertical: 'top',
    maxHeight: 200,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  analyzeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  clearButton: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  riskLevel: {
    borderLeftWidth: 4,
    paddingLeft: 16,
    paddingVertical: 16,
    marginBottom: 20,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riskTextContainer: {
    flex: 1,
  },
  riskLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  riskValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  resultLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: colors.dark,
    fontWeight: '600',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  flagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  flagText: {
    fontSize: 14,
    color: colors.dark,
    flex: 1,
  },
  summaryBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  summaryText: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  recommendationBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: '#b45309',
    lineHeight: 18,
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tipsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#eef2ff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 18,
  },
  disclaimer: {
    marginHorizontal: 20,
    marginBottom: 32,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
  },
});
