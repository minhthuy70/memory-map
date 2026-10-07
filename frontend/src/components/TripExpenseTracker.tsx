'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface TripExpense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  notes: string | null;
}

export default function TripExpenseTracker() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState<TripExpense[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3001/trip-planning/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/trip-planning/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newExpense,
          amount: parseFloat(newExpense.amount),
        }),
      });

      setShowAddForm(false);
      setNewExpense({
        title: '',
        amount: '',
        currency: 'USD',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      await fetchExpenses();
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/trip-planning/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const categoryIcons = {
    food: '🍽️',
    hotel: '🏨',
    transport: '🚗',
    tickets: '🎫',
    shopping: '🛍️',
  };

  const categoryColors = {
    food: 'bg-orange-100 text-orange-800',
    hotel: 'bg-blue-100 text-blue-800',
    transport: 'bg-green-100 text-green-800',
    tickets: 'bg-purple-100 text-purple-800',
    shopping: 'bg-pink-100 text-pink-800',
  };

  const totalByCurrency = expenses.reduce((acc, expense) => {
    acc[expense.currency] = (acc[expense.currency] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Trip Budget & Expense Tracker</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Expense
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-3">Total Expenses</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(totalByCurrency).map(([currency, total]) => (
            <div key={currency} className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {total.toFixed(2)} {currency}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
          <form onSubmit={addExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                placeholder="Lunch at restaurant"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="25.00"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={newExpense.currency}
                  onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="VND">VND</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="food">Food</option>
                <option value="hotel">Hotel</option>
                <option value="transport">Transport</option>
                <option value="tickets">Tickets</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={newExpense.notes}
                onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                placeholder="Additional details..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Expense History</h3>

        {expenses.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No expenses recorded yet</p>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">
                    {categoryIcons[expense.category as keyof typeof categoryIcons]}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{expense.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${categoryColors[expense.category as keyof typeof categoryColors]}`}>
                        {expense.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                    {expense.notes && (
                      <p className="text-sm text-gray-600 mt-1">{expense.notes}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {expense.amount.toFixed(2)} {expense.currency}
                  </p>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="text-xs text-red-500 hover:text-red-700 mt-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">About Expense Tracker</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Log expenses per memory location</li>
          <li>• Multi-currency support with live FX rates</li>
          <li>• Category breakdown: food, hotel, transport, tickets, shopping</li>
          <li>• Split bill with travel partners</li>
        </ul>
      </div>
    </div>
  );
}
