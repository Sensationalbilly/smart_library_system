import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/colors';
import { formatCurrency } from '../utils/formatters';

export default function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setTimeout(() => {
      setAnalytics({
        monthlyIncome: 8500,
        monthlyExpense: 3079.50,
        savingsRate: 63.8,
        topCategory: 'Housing',
        topCategoryAmount: 1200,
        averageTransaction: 45.50,
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const AnalyticsCard = ({ title, value, subtitle, color }) => (
    <View style={styles.card}>
      <View style={[styles.cardHeader, { borderLeftColor: color }]}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>November 2025</Text>
      </View>

      <View style={styles.content}>
        <AnalyticsCard
          title="Monthly Income"
          value={formatCurrency(analytics.monthlyIncome)}
          color="#10b981"
        />
        <AnalyticsCard
          title="Monthly Expenses"
          value={formatCurrency(analytics.monthlyExpense)}
          color="#ef4444"
        />
        <AnalyticsCard
          title="Savings Rate"
          value={`${analytics.savingsRate}%`}
          color={colors.primary}
        />
        <AnalyticsCard
          title="Top Category"
          value={analytics.topCategory}
          subtitle={formatCurrency(analytics.topCategoryAmount)}
          color="#f59e0b"
        />
        <AnalyticsCard
          title="Avg. Transaction"
          value={formatCurrency(analytics.averageTransaction)}
          color="#8b5cf6"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expense Breakdown</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>
            Chart visualization coming soon
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trends</Text>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Highest spending day:</Text>
          <Text style={styles.trendValue}>Friday - $450.75</Text>
        </View>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Most common category:</Text>
          <Text style={styles.trendValue}>Food & Dining</Text>
        </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  chartPlaceholder: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholderText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  trendItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  trendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
});
