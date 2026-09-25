'use client';

import { useState } from 'react';
import { Mail, X, Plus, Trash2, Edit2, Send, RefreshCw, CheckCircle, AlertTriangle, Info, Eye, Save, Copy, FileText, Zap, Shield } from 'lucide-react';

interface EmailTemplateManagementProps {
  onCancel?: () => void;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'welcome' | 'notification' | 'alert' | 'marketing' | 'transactional';
  variables: string[];
  content: string;
  lastModified: string;
  usage: number;
}

export default function EmailTemplateManagement({ onCancel }: EmailTemplateManagementProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    { id: '1', name: 'Welcome Email', subject: 'Welcome to Memory Map!', type: 'welcome', variables: ['{{username}}', '{{activation_link}}'], content: 'Hi {{username}},\n\nWelcome to Memory Map! Click the link below to activate your account:\n{{activation_link}}\n\nBest regards,\nThe Memory Map Team', lastModified: '2026-09-10', usage: 5420 },
    { id: '2', name: 'Password Reset', subject: 'Reset Your Password', type: 'transactional', variables: ['{{username}}', '{{reset_link}}'], content: 'Hi {{username}},\n\nClick the link below to reset your password:\n{{reset_link}}\n\nThis link expires in 24 hours.\n\nBest regards,\nThe Memory Map Team', lastModified: '2026-09-08', usage: 1250 },
    { id: '3', name: 'New Memory Notification', subject: 'New Memory Added', type: 'notification', variables: ['{{username}}', '{{memory_title}}', '{{memory_date}}'], content: 'Hi {{username}},\n\nA new memory "{{memory_title}}" was added on {{memory_date}}.\n\nView it in your Memory Map!\n\nBest regards,\nThe Memory Map Team', lastModified: '2026-09-12', usage: 890 },
    { id: '4', name: 'System Alert', subject: 'System Maintenance Notice', type: 'alert', variables: ['{{maintenance_start}}', '{{maintenance_end}}'], content: 'Dear User,\n\nWe will be performing system maintenance from {{maintenance_start}} to {{maintenance_end}}.\n\nThe service may be temporarily unavailable during this time.\n\nThank you for your patience.\n\nBest regards,\nThe Memory Map Team', lastModified: '2026-09-14', usage: 3200 },
  ]);

  const [editTemplate, setEditTemplate] = useState({
    name: '',
    subject: '',
    type: 'notification' as 'welcome' | 'notification' | 'alert' | 'marketing' | 'transactional',
    variables: '',
    content: '',
  });

  const startEditing = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditTemplate({
      name: template.name,
      subject: template.subject,
      type: template.type,
      variables: template.variables.join(', '),
      content: template.content,
    });
    setIsEditing(true);
  };

  const startCreating = () => {
    setSelectedTemplate(null);
    setEditTemplate({
      name: '',
      subject: '',
      type: 'notification',
      variables: '',
      content: '',
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedTemplate(null);
    setEditTemplate({
      name: '',
      subject: '',
      type: 'notification',
      variables: '',
      content: '',
    });
  };

  const saveTemplate = () => {
    if (editTemplate.name && editTemplate.subject && editTemplate.content) {
      const variables = editTemplate.variables.split(',').map(v => v.trim()).filter(v => v);
      
      if (selectedTemplate) {
        setTemplates(templates.map(t => t.id === selectedTemplate.id ? {
          ...t,
          name: editTemplate.name,
          subject: editTemplate.subject,
          type: editTemplate.type,
          variables,
          content: editTemplate.content,
          lastModified: new Date().toISOString().split('T')[0],
        } : t));
      } else {
        const newId = Date.now().toString();
        setTemplates([...templates, {
          id: newId,
          name: editTemplate.name,
          subject: editTemplate.subject,
          type: editTemplate.type,
          variables,
          content: editTemplate.content,
          lastModified: new Date().toISOString().split('T')[0],
          usage: 0,
        }]);
      }
      cancelEditing();
    }
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const duplicateTemplate = (template: EmailTemplate) => {
    const newId = Date.now().toString();
    setTemplates([...templates, {
      ...template,
      id: newId,
      name: `${template.name} (Copy)`,
      usage: 0,
    }]);
  };

  const sendTestEmail = (id: string) => {
    // Send test email
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'welcome': return <Shield className="h-4 w-4" />;
      case 'notification': return <Info className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'marketing': return <Zap className="h-4 w-4" />;
      case 'transactional': return <FileText className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'notification': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'alert': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'marketing': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'transactional': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Email Template Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage email templates and content
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Templates</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{templates.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Usage</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{templates.reduce((sum, t) => sum + t.usage, 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Most Used</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{templates.reduce((max, t) => t.usage > max.usage ? t : max, templates[0]).name.split(' ')[0]}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Types</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{new Set(templates.map(t => t.type)).size}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startCreating}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            New Template
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {isEditing && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              {selectedTemplate ? 'Edit Template' : 'Create New Template'}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Template Name</label>
                <input
                  type="text"
                  value={editTemplate.name}
                  onChange={(e) => setEditTemplate({ ...editTemplate, name: e.target.value })}
                  placeholder="Enter template name..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Subject</label>
                <input
                  type="text"
                  value={editTemplate.subject}
                  onChange={(e) => setEditTemplate({ ...editTemplate, subject: e.target.value })}
                  placeholder="Enter email subject..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Type</label>
                <select
                  value={editTemplate.type}
                  onChange={(e) => setEditTemplate({ ...editTemplate, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                >
                  <option value="welcome">Welcome</option>
                  <option value="notification">Notification</option>
                  <option value="alert">Alert</option>
                  <option value="marketing">Marketing</option>
                  <option value="transactional">Transactional</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Variables (comma-separated)</label>
                <input
                  type="text"
                  value={editTemplate.variables}
                  onChange={(e) => setEditTemplate({ ...editTemplate, variables: e.target.value })}
                  placeholder="{{username}}, {{link}}, ..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Content</label>
                <textarea
                  value={editTemplate.content}
                  onChange={(e) => setEditTemplate({ ...editTemplate, content: e.target.value })}
                  placeholder="Enter email content..."
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveTemplate}
                  disabled={!editTemplate.name || !editTemplate.subject || !editTemplate.content}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors"
                >
                  <Save className="h-3 w-3 inline mr-1" />
                  Save Template
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-4 py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Email Templates</h4>
          <div className="space-y-2">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  {getTypeIcon(template.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{template.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getTypeColor(template.type)}`}>
                        {template.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{template.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{template.variables.length} variables</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{template.usage.toLocaleString()} uses</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Modified: {template.lastModified}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => sendTestEmail(template.id)}
                    className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                    title="Send test"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateTemplate(template)}
                    className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => startEditing(template)}
                    className="p-1 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTemplate(template.id)}
                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Template Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use {'{{variable}}'} syntax for dynamic content</li>
              <li>• Test templates before sending to users</li>
              <li>• Keep subjects clear and concise</li>
              <li>• Monitor template usage for optimization</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
