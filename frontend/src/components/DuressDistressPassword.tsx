'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface DuressPassword {
  id: string;
  isEmergency: boolean;
  alertSent: boolean;
  alertContacts: string;
  lastUsedAt: string | null;
  createdAt: string;
}

export default function DuressDistressPassword() {
  const { token } = useAuth();
  const [duressPasswords, setDuressPasswords] = useState<DuressPassword[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPassword, setNewPassword] = useState({
    password: '',
    isEmergency: false,
    alertContacts: [] as string[],
  });
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);

  useEffect(() => {
    fetchDuressPasswords();
  }, [token]);

  const fetchDuressPasswords = async () => {
    try {
      const response = await fetch('http://localhost:3001/privacy-vault/duress-password', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDuressPasswords(data);
    } catch (error) {
      console.error('Failed to fetch duress passwords:', error);
    }
  };

  const createDuressPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/privacy-vault/duress-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPassword),
      });

      setShowAddForm(false);
      setNewPassword({ password: '', isEmergency: false, alertContacts: [] });
      await fetchDuressPasswords();
    } catch (error) {
      console.error('Failed to create duress password:', error);
    }
  };

  const verifyDuressPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/privacy-vault/duress-password/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: verifyPassword }),
      });

      const data = await response.json();
      setVerifyResult(data);
      setVerifyPassword('');
    } catch (error) {
      console.error('Failed to verify password:', error);
    }
  };

  const deleteDuressPassword = async (id: string) => {
    if (!confirm('Are you sure you want to delete this duress password?')) return;

    try {
      await fetch(`http://localhost:3001/privacy-vault/duress-password/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchDuressPasswords();
    } catch (error) {
      console.error('Failed to delete duress password:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Duress Distress Password</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Add Duress Password
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-4">Create Duress Password</h3>
          <form onSubmit={createDuressPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={newPassword.password}
                onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                placeholder="Enter duress password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isEmergency"
                checked={newPassword.isEmergency}
                onChange={(e) => setNewPassword({ ...newPassword, isEmergency: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="isEmergency" className="text-sm text-gray-700">
                Emergency password (sends alert to contacts)
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Create Duress Password
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

      {/* Verify Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Verify Password</h3>
        <form onSubmit={verifyDuressPassword} className="flex gap-2">
          <input
            type="password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            placeholder="Enter password to verify"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Verify
          </button>
        </form>

        {verifyResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            verifyResult.isDuress
              ? 'bg-orange-100 text-orange-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {verifyResult.isDuress ? (
              <div>
                <p className="font-medium">⚠️ Duress Password Detected!</p>
                {verifyResult.isEmergency && (
                  <p className="text-sm mt-1">Emergency alert sent to contacts</p>
                )}
              </div>
            ) : (
              <p className="font-medium">✓ Normal password</p>
            )}
          </div>
        )}
      </div>

      {/* Duress Passwords List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Your Duress Passwords</h3>

        {duressPasswords.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No duress passwords configured</p>
        ) : (
          <div className="space-y-3">
            {duressPasswords.map((dp) => (
              <div
                key={dp.id}
                className="p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {dp.isEmergency && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                          Emergency
                        </span>
                      )}
                      {dp.alertSent && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700">
                          Alert Sent
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(dp.createdAt).toLocaleDateString()}
                    </p>
                    {dp.lastUsedAt && (
                      <p className="text-xs text-gray-500">
                        Last used: {new Date(dp.lastUsedAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteDuressPassword(dp.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {dp.alertContacts && JSON.parse(dp.alertContacts).length > 0 && (
                  <div className="mt-2 p-2 bg-orange-100 rounded text-xs text-orange-800">
                    <strong>Alert contacts:</strong> {JSON.parse(dp.alertContacts).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-orange-50 rounded-lg">
        <h4 className="font-semibold text-orange-800 mb-2">How It Works</h4>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Secondary emergency PIN displays dummy profile</li>
          <li>• Shows harmless generic photos to protect real data</li>
          <li>• Silently sends alert to emergency contacts</li>
          <li>• Perfect for forced unlock situations</li>
        </ul>
      </div>
    </div>
  );
}
