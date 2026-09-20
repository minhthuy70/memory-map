'use client';

import { useState } from 'react';
import { Webhook, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink, Bell, Send } from 'lucide-react';

interface WebhookSupportProps {
  onCancel?: () => void;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  lastTriggered?: string;
  triggerCount: number;
  successRate: number;
}

interface WebhookEvent {
  id: string;
  webhookId: string;
  webhookName: string;
  eventType: string;
  payload: string;
  statusCode: number;
  triggeredAt: string;
  status: 'success' | 'failed' | 'pending';
}

interface WebhookSettings {
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
  signatureVerification: boolean;
}

export default function WebhookSupport({ onCancel }: WebhookSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isWebhookEnabled, setIsWebhookEnabled] = useState(true);

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    { id: '1', name: 'Memory Created Hook', url: 'https://example.com/webhook/memory-created', events: ['memory.created'], secret: 'whsec_...', isActive: true, lastTriggered: '2024-01-17 18:30', triggerCount: 1250, successRate: 98.5 },
    { id: '2', name: 'Memory Deleted Hook', url: 'https://example.com/webhook/memory-deleted', events: ['memory.deleted'], secret: 'whsec_...', isActive: true, lastTriggered: '2024-01-16 10:15', triggerCount: 450, successRate: 99.2 },
    { id: '3', name: 'Backup Hook', url: 'https://backup.example.com/webhook', events: ['memory.created', 'memory.updated', 'memory.deleted'], secret: 'whsec_...', isActive: false, lastTriggered: '2024-01-15 14:00', triggerCount: 3200, successRate: 97.8 },
  ]);

  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([
    { id: '1', webhookId: '1', webhookName: 'Memory Created Hook', eventType: 'memory.created', payload: '{"id": "mem123", "title": "Test"}', statusCode: 200, triggeredAt: '2024-01-17 18:30', status: 'success' },
    { id: '2', webhookId: '2', webhookName: 'Memory Deleted Hook', eventType: 'memory.deleted', payload: '{"id": "mem456"}', statusCode: 200, triggeredAt: '2024-01-16 10:15', status: 'success' },
  ]);

  const [webhookSettings, setWebhookSettings] = useState<WebhookSettings>({
    retryAttempts: 3,
    retryDelay: 5,
    timeout: 30,
    signatureVerification: true,
  });

  const availableEvents = [
    'memory.created',
    'memory.updated',
    'memory.deleted',
    'user.created',
    'user.updated',
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(webhook => 
      webhook.id === id ? { ...webhook, isActive: !webhook.isActive } : webhook
    ));
  };

  const testWebhook = (id: string) => {
    const webhook = webhooks.find(w => w.id === id);
    if (!webhook) return;

    const newEvent: WebhookEvent = {
      id: Date.now().toString(),
      webhookId: id,
      webhookName: webhook.name,
      eventType: webhook.events[0],
      payload: '{"test": true}',
      statusCode: 200,
      triggeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };
    setWebhookEvents([newEvent, ...webhookEvents]);
    
    setTimeout(() => {
      setWebhookEvents(events => events.map(e => 
        e.id === newEvent.id ? { ...e, status: 'success' } : e
      ));
      setWebhooks(hooks => hooks.map(h => 
        h.id === id ? { ...h, triggerCount: h.triggerCount + 1, lastTriggered: new Date().toISOString().replace('T', ' ').substring(0, 16) } : h
      ));
    }, 1000);
  };

  const createWebhook = () => {
    const newWebhook: Webhook = {
      id: Date.now().toString(),
      name: 'New Webhook',
      url: 'https://example.com/webhook',
      events: ['memory.created'],
      secret: 'whsec_' + Math.random().toString(36).substring(2, 24),
      isActive: true,
      triggerCount: 0,
      successRate: 100,
    };
    setWebhooks([...webhooks, newWebhook]);
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Webhook className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Webhook Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hỗ trợ webhook (triggers: memory.created, memory.deleted...)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isWebhookEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isWebhookEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Webhooks</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{webhooks.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{webhooks.filter(w => w.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Triggers</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{webhooks.reduce((acc, w) => acc + w.triggerCount, 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Success</p>
            <p className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">
              {(webhooks.reduce((acc, w) => acc + w.successRate, 0) / webhooks.length).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isWebhookEnabled}
              onChange={(e) => setIsWebhookEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Webhooks</span>
          </div>
          <button
            type="button"
            onClick={createWebhook}
            className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Create Webhook
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Webhook Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-900 dark:text-white">Retry Attempts</span>
              </div>
              <input
                type="number"
                value={webhookSettings.retryAttempts}
                onChange={(e) => setWebhookSettings({ ...webhookSettings, retryAttempts: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Retry Delay (sec)</span>
              </div>
              <input
                type="number"
                value={webhookSettings.retryDelay}
                onChange={(e) => setWebhookSettings({ ...webhookSettings, retryDelay: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Timeout (sec)</span>
              </div>
              <input
                type="number"
                value={webhookSettings.timeout}
                onChange={(e) => setWebhookSettings({ ...webhookSettings, timeout: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Signature Verification</span>
              </div>
              <input
                type="checkbox"
                checked={webhookSettings.signatureVerification}
                onChange={(e) => setWebhookSettings({ ...webhookSettings, signatureVerification: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Webhooks</h4>
          <div className="space-y-2">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <Webhook className="h-4 w-4 text-pink-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{webhook.name}</span>
                        {webhook.isActive && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{webhook.url}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {webhook.isActive && (
                      <button
                        type="button"
                        onClick={() => testWebhook(webhook.id)}
                        className="px-2 py-1 rounded text-xs bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" />
                        Test
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleWebhook(webhook.id)}
                      className={`px-2 py-1 rounded text-xs ${webhook.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {webhook.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteWebhook(webhook.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Events: {webhook.events.join(', ')}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Triggers: {webhook.triggerCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Success: {webhook.successRate}%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last: {webhook.lastTriggered || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Events</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {webhookEvents.map((event) => (
              <div key={event.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-lg">
                      <Bell className="h-4 w-4 text-fuchsia-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{event.webhookName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{event.eventType} • {event.statusCode}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{event.triggeredAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Webhook Support Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Subscribe to memory events (created, updated, deleted)</li>
              <li>• Configure retry attempts and delays</li>
              <li>• Enable signature verification for security</li>
              <li>• Monitor webhook delivery success rates</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
