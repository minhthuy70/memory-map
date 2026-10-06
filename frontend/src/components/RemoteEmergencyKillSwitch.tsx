'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function RemoteEmergencyKillSwitch() {
  const { token } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);
  const [result, setResult] = useState<any>(null);

  const triggerKillSwitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== 'DESTROY ALL DATA') {
      alert('Please type "DESTROY ALL DATA" to confirm');
      return;
    }

    if (!confirm('⚠️ WARNING: This action is irreversible!\n\nThis will:\n• Revoke all active sessions\n• Destroy all vault memories\n• Delete all encrypted data\n\nAre you absolutely sure?')) {
      return;
    }

    setIsTriggering(true);
    try {
      const response = await fetch('http://localhost:3001/privacy-vault/emergency-kill-switch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setResult(data);
      setConfirmText('');
    } catch (error) {
      console.error('Failed to trigger kill switch:', error);
      alert('Failed to trigger kill switch');
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-4 border-red-300">
      <h2 className="text-2xl font-bold text-red-800 mb-6">Remote Emergency Kill-Switch</h2>

      <div className="mb-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
        <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ Emergency Data Wipe</h3>
        <p className="text-sm text-red-700 mb-4">
          Use this feature if your device is stolen or compromised. This will:
        </p>
        <ul className="text-sm text-red-700 space-y-2 ml-4">
          <li>• Instantly revoke all active JWT tokens and sessions</li>
          <li>• Destroy all vault memories permanently</li>
          <li>• Log the emergency action in audit trail</li>
          <li>• No recovery possible after trigger</li>
        </ul>
      </div>

      {result ? (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✓ Kill Switch Triggered</h3>
          <p className="text-sm text-green-700">{result.message}</p>
          <p className="text-xs text-green-600 mt-2">
            All sessions revoked and vault memories destroyed at {new Date().toLocaleString()}
          </p>
        </div>
      ) : (
        <form onSubmit={triggerKillSwitch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type "DESTROY ALL DATA" to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DESTROY ALL DATA"
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono uppercase"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isTriggering || confirmText !== 'DESTROY ALL DATA'}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isTriggering ? 'Triggering...' : '🔴 TRIGGER EMERGENCY KILL SWITCH'}
          </button>
        </form>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">When to Use</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Device stolen or lost</li>
          <li>• Suspicious unauthorized access detected</li>
          <li>• Compromised credentials</li>
          <li>• Forced unlock attempt detected</li>
        </ul>
      </div>
    </div>
  );
}
