/**
 * Transaction Categories
 */

export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', icon: 'cart' },
  { id: 'utilities', label: 'Utilities', icon: 'flash' },
  { id: 'entertainment', label: 'Entertainment', icon: 'film' },
  { id: 'dining', label: 'Dining', icon: 'restaurant' },
  { id: 'transportation', label: 'Transportation', icon: 'car' },
  { id: 'healthcare', label: 'Healthcare', icon: 'medical' },
  { id: 'shopping', label: 'Shopping', icon: 'bag' },
  { id: 'housing', label: 'Housing', icon: 'home' },
  { id: 'salary', label: 'Salary', icon: 'briefcase' },
  { id: 'bonus', label: 'Bonus', icon: 'gift' },
  { id: 'investment', label: 'Investment', icon: 'trending-up' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find((c) => c.id === id);
};
