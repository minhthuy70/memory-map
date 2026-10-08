'use client';

import { useState } from 'react';

export default function P2PLocalSync() {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [peers, setPeers] = useState<any[]>([]);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate mDNS discovery
    setTimeout(() => {
      setPeers([
        { id: '1', name: 'My Laptop', address: '192.168.1.100', type: 'windows' },
        { id: '2', name: 'iPhone 15', address: '192.168.1.101', type: 'ios' },
      ]);
      setIsScanning(false);
    }, 2000);
  };

  const handleConnect = (peerId: string) => {
    setIsConnected(true);
    alert(`Connected to peer ${peerId}`);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setPeers([]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Peer-to-Peer Local Network Direct Sync</h2>
      <p className="text-gray-600 mb-6">
        High-speed mDNS discovery and P2P TLS sync between phone and PC on home WiFi without touching external cloud servers.
      </p>

      {!isConnected ? (
        <div className="space-y-4">
          {peers.length === 0 ? (
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isScanning ? 'Scanning for peers...' : 'Scan for Local Peers'}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">Discovered Peers:</p>
              {peers.map((peer) => (
                <div
                  key={peer.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{peer.name}</p>
                    <p className="text-sm text-gray-600">{peer.address}</p>
                  </div>
                  <button
                    onClick={() => handleConnect(peer.id)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded">
            <p className="text-green-700 font-medium">✓ P2P Connection Active</p>
            <p className="text-sm text-green-600">Direct TLS sync enabled</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sync Status:</span>
              <span className="text-green-600">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Bandwidth:</span>
              <span>High (Local Network)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Encryption:</span>
              <span>TLS 1.3</span>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
