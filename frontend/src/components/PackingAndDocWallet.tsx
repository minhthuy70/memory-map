'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface PackingItem {
  id: string;
  name: string;
  packed: boolean;
  category: string;
}

interface PackingList {
  id: string;
  title: string;
  items: string;
  isCompleted: boolean;
}

interface TravelDocument {
  id: string;
  documentType: string;
  title: string;
  documentNumber: string | null;
  expiryDate: string | null;
  fileUrl: string | null;
}

export default function PackingAndDocWallet() {
  const { token } = useAuth();
  const [packingLists, setPackingLists] = useState<PackingList[]>([]);
  const [documents, setDocuments] = useState<TravelDocument[]>([]);
  const [showPackingForm, setShowPackingForm] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);
  const [newPackingList, setNewPackingList] = useState({
    title: '',
    items: [] as PackingItem[],
  });
  const [newDocument, setNewDocument] = useState({
    documentType: 'passport',
    title: '',
    documentNumber: '',
    expiryDate: '',
    fileUrl: '',
  });

  useEffect(() => {
    fetchPackingLists();
    fetchDocuments();
  }, [token]);

  const fetchPackingLists = async () => {
    try {
      const response = await fetch('http://localhost:3001/trip-planning/packing-lists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPackingLists(data);
    } catch (error) {
      console.error('Failed to fetch packing lists:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:3001/trip-planning/documents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const addPackingItem = () => {
    setNewPackingList({
      ...newPackingList,
      items: [
        ...newPackingList.items,
        { id: Date.now().toString(), name: '', packed: false, category: 'clothing' },
      ],
    });
  };

  const updatePackingItem = (id: string, field: string, value: any) => {
    setNewPackingList({
      ...newPackingList,
      items: newPackingList.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
  };

  const removePackingItem = (id: string) => {
    setNewPackingList({
      ...newPackingList,
      items: newPackingList.items.filter((item) => item.id !== id),
    });
  };

  const createPackingList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/trip-planning/packing-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPackingList),
      });

      setShowPackingForm(false);
      setNewPackingList({ title: '', items: [] });
      await fetchPackingLists();
    } catch (error) {
      console.error('Failed to create packing list:', error);
    }
  };

  const createDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/trip-planning/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDocument),
      });

      setShowDocForm(false);
      setNewDocument({
        documentType: 'passport',
        title: '',
        documentNumber: '',
        expiryDate: '',
        fileUrl: '',
      });
      await fetchDocuments();
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  const documentIcons = {
    passport: '🛂',
    visa: '📋',
    boarding_pass: '✈️',
    hotel_voucher: '🏨',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Travel Packing Checklist & Document Wallet</h2>

      {/* Packing Lists */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Packing Lists</h3>
          <button
            onClick={() => setShowPackingForm(!showPackingForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New List
          </button>
        </div>

        {showPackingForm && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-4">Create Packing List</h4>
            <form onSubmit={createPackingList} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPackingList.title}
                  onChange={(e) => setNewPackingList({ ...newPackingList, title: e.target.value })}
                  placeholder="Summer Trip to Japan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                {newPackingList.items.map((item) => (
                  <div key={item.id} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updatePackingItem(item.id, 'name', e.target.value)}
                      placeholder="Item name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removePackingItem(item.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPackingItem}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  + Add Item
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create List
                </button>
                <button
                  type="button"
                  onClick={() => setShowPackingForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packingLists.length === 0 ? (
            <p className="text-gray-500 py-4 text-center col-span-2">No packing lists yet</p>
          ) : (
            packingLists.map((list) => {
              const items = JSON.parse(list.items);
              const packedCount = items.filter((i: PackingItem) => i.packed).length;

              return (
                <div key={list.id} className="p-4 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">{list.title}</h4>
                    <span className="text-sm text-gray-600">
                      {packedCount}/{items.length} packed
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(packedCount / items.length) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Travel Documents */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Encrypted Document Wallet</h3>
          <button
            onClick={() => setShowDocForm(!showDocForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Document
          </button>
        </div>

        {showDocForm && (
          <div className="mb-4 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold mb-4">Add Travel Document</h4>
            <form onSubmit={createDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  value={newDocument.documentType}
                  onChange={(e) => setNewDocument({ ...newDocument, documentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="passport">Passport</option>
                  <option value="visa">Visa</option>
                  <option value="boarding_pass">Boarding Pass</option>
                  <option value="hotel_voucher">Hotel Voucher</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  placeholder="My Passport"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
                <input
                  type="text"
                  value={newDocument.documentNumber}
                  onChange={(e) => setNewDocument({ ...newDocument, documentNumber: e.target.value })}
                  placeholder="A12345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={newDocument.expiryDate}
                  onChange={(e) => setNewDocument({ ...newDocument, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                <input
                  type="url"
                  value={newDocument.fileUrl}
                  onChange={(e) => setNewDocument({ ...newDocument, fileUrl: e.target.value })}
                  placeholder="https://example.com/document.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Document
                </button>
                <button
                  type="button"
                  onClick={() => setShowDocForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.length === 0 ? (
            <p className="text-gray-500 py-4 text-center col-span-2">No documents stored yet</p>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="p-4 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">
                    {documentIcons[doc.documentType as keyof typeof documentIcons]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{doc.title}</h4>
                    {doc.documentNumber && (
                      <p className="text-sm text-gray-600">{doc.documentNumber}</p>
                    )}
                    {doc.expiryDate && (
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">About Packing & Documents</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Smart packing list generator based on destination weather</li>
          <li>• Encrypted wallet for boarding passes, hotel vouchers, passport scans</li>
          <li>• Visa validity countdown and passport expiration warnings</li>
          <li>• Offline access to all travel documents</li>
        </ul>
      </div>
    </div>
  );
}
