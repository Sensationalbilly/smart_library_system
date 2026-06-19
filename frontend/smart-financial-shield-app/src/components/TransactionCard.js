import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';
import { CATEGORIES } from '../constants/categories';

export default function TransactionCard({ transaction, onDelete }) {
  const category = CATEGORIES.find((c) => c.id === transaction.category);
  const isIncome = transaction.type === 'income';
  const color = isIncome ? '#10b981' : '#ef4444';

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete && onDelete(transaction.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
        <Ionicons
          name={category?.icon || 'wallet'}
          size={24}
          color={color}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.category}>{category?.label}</Text>
        <Text style={styles.description}>{transaction.description}</Text>
      </View>

      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color }]}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  description: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  rightContent: {
    marginRight: 8,
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
  },
});
