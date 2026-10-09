'use client';

import { useState } from 'react';

export default function CalculatorCamouflage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [secretPin, setSecretPin] = useState('');
  const [decoyName, setDecoyName] = useState('Calculator');
  const [customIcon, setCustomIcon] = useState('');
  const [isCamouflaged, setIsCamouflaged] = useState(false);

  const handleSetup = () => {
    if (secretPin.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    setIsEnabled(true);
    alert('Calculator camouflage setup complete!');
  };

  const handleEnterPin = () => {
    if (secretPin === enteredPin) {
      setIsCamouflaged(false);
      alert('Vault opened!');
    } else {
      alert('Invalid PIN - showing decoy app');
    }
  };

  const [enteredPin, setEnteredPin] = useState('');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Calculator Camouflage & Decoy Mode</h2>
      <p className="text-gray-600 mb-6">
        App disguise as fully functional calculator, typing secret PIN opens Memory Map vault, customizable app icon and decoy name.
      </p>

      <div className="space-y-4">
        {isCamouflaged ? (
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-medium mb-3 text-blue-800">Decoy Mode Active</h3>
            <p className="text-sm text-blue-700 mb-4">App appears as: {decoyName}</p>
            <div className="p-4 bg-white rounded mb-4">
              <div className="grid grid-cols-4 gap-2">
                {[7, 8, 9, '÷', 4, 5, 6, '×', 1, 2, 3, '-', '0', '.', '='].map((key) => (
                  <button
                    key={key}
                    onClick={() => setEnteredPin(enteredPin + key)}
                    className="p-3 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleEnterPin}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Enter Secret PIN
            </button>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Secret PIN (to open vault)</label>
              <input
                type="password"
                value={secretPin}
                onChange={(e) => setSecretPin(e.target.value)}
                placeholder="Enter 4+ digit PIN"
                className="w-full p-2 border rounded"
                maxLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Decoy App Name</label>
              <input
                type="text"
                value={decoyName}
                onChange={(e) => setDecoyName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Custom Icon URL (optional)</label>
              <input
                type="text"
                value={customIcon}
                onChange={(e) => setCustomIcon(e.target.value)}
                placeholder="https://example.com/icon.png"
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              onClick={handleSetup}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Setup Camouflage
            </button>

            {isEnabled && (
              <button
                onClick={() => setIsCamouflaged(true)}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Activate Decoy Mode
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
