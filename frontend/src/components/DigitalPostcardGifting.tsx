'use client';

import { useState } from 'react';

export default function DigitalPostcardGifting() {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [stampStyle, setStampStyle] = useState('vintage');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Digital Memory Postcard Gifting</h3>
      <p className="text-gray-600 mb-4">Gửi tặng bưu thiếp kỷ niệm số với vintage stamps và personalized message</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Recipient Email</label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="friend@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Write a heartfelt message..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stamp Style</label>
          <select
            value={stampStyle}
            onChange={(e) => setStampStyle(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="vintage">Vintage 📜</option>
            <option value="modern">Modern ✨</option>
            <option value="artistic">Artistic 🎨</option>
          </select>
        </div>

        <div className="bg-amber-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Postcard Preview</h4>
          <div className="h-32 bg-gradient-to-b from-amber-200 via-yellow-300 to-orange-400 rounded flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-4xl mb-2">📮</div>
              <span className="text-white font-bold text-lg">Digital Postcard</span>
              <div className="text-white text-sm">{stampStyle} Stamp</div>
            </div>
            <div className="absolute top-2 right-2 text-2xl">💌</div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700"
        >
          {saved ? 'Sent!' : 'Send Postcard'}
        </button>
      </div>
    </div>
  );
}
