'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Command,
  Download,
  ExternalLink,
  FileText,
  Info,
  Plus,
  RefreshCw,
  Settings,
  Terminal,
  Trash2
} from 'lucide-react';

interface CLIToolProps {
  onCancel?: () => void;
}

interface CLICommand {
  id: string;
  name: string;
  command: string;
  description: string;
  category: string;
  isImplemented: boolean;
}

interface CLIInstall {
  id: string;
  method: string;
  command: string;
  description: string;
}

interface CLISetting {
  id: string;
  name: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
}

export default function CLITool({ onCancel }: CLIToolProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCLIEnabled, setIsCLIEnabled] = useState(true);

  const [cliCommands, setCliCommands] = useState<CLICommand[]>([
    { id: '1', name: 'memory init', command: 'memory init', description: 'Initialize a new memory project', category: 'Setup', isImplemented: true },
    { id: '2', name: 'memory create', command: 'memory create [title]', description: 'Create a new memory', category: 'CRUD', isImplemented: true },
    { id: '3', name: 'memory list', command: 'memory list', description: 'List all memories', category: 'CRUD', isImplemented: true },
    { id: '4', name: 'memory get', command: 'memory get [id]', description: 'Get a specific memory', category: 'CRUD', isImplemented: true },
    { id: '5', name: 'memory update', command: 'memory update [id]', description: 'Update a memory', category: 'CRUD', isImplemented: true },
    { id: '6', name: 'memory delete', command: 'memory delete [id]', description: 'Delete a memory', category: 'CRUD', isImplemented: true },
    { id: '7', name: 'memory search', command: 'memory search [query]', description: 'Search memories', category: 'Search', isImplemented: true },
    { id: '8', name: 'memory upload', command: 'memory upload [file]', description: 'Upload a file to memory', category: 'Files', isImplemented: true },
  ]);

  const [cliInstalls, setCliInstalls] = useState<CLIInstall[]>([
    { id: '1', method: 'npm', command: 'npm install -g @memorymap/cli', description: 'Install via npm globally' },
    { id: '2', method: 'yarn', command: 'yarn global add @memorymap/cli', description: 'Install via yarn globally' },
    { id: '3', method: 'brew', command: 'brew install memorymap-cli', description: 'Install via Homebrew (macOS)' },
  ]);

  const [cliSettings, setCliSettings] = useState<CLISetting[]>([
    { id: '1', name: 'API Key', value: 'sk_test_...', type: 'string' },
    { id: '2', name: 'Default Output Format', value: 'json', type: 'string' },
    { id: '3', name: 'Timeout (seconds)', value: '30', type: 'number' },
    { id: '4', name: 'Verbose Output', value: 'true', type: 'boolean' },
  ]);

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  const runCommand = (command: string) => {
    console.log(`Running command: ${command}`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              CLI Tool (memory-map-cli)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Công cụ CLI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isCLIEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isCLIEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Commands</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{cliCommands.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Implemented</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{cliCommands.filter(c => c.isImplemented).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Categories</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{[...new Set(cliCommands.map(c => c.category))].length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Settings</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{cliSettings.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isCLIEnabled}
              onChange={(e) => setIsCLIEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable CLI</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Download CLI
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Installation</h4>
          <div className="space-y-2">
            {cliInstalls.map((install) => (
              <div key={install.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <Terminal className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{install.method}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{install.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCommand(install.command)}
                    className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white flex items-center gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    Copy
                  </button>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded font-mono text-xs text-slate-700 dark:text-slate-300">
                  {install.command}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">CLI Commands</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cliCommands.map((command) => (
              <div key={command.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Command className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{command.name}</span>
                        {command.isImplemented && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Implemented
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {command.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{command.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => copyCommand(command.command)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      Copy
                    </button>
                    {command.isImplemented && (
                      <button
                        type="button"
                        onClick={() => runCommand(command.command)}
                        className="px-2 py-1 rounded text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                      >
                        <Terminal className="h-3 w-3" />
                        Run
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded font-mono text-xs text-slate-700 dark:text-slate-300">
                  {command.command}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">CLI Settings</h4>
          <div className="space-y-2">
            {cliSettings.map((setting) => (
              <div key={setting.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <Settings className="h-4 w-4 text-teal-400" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{setting.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Type: {setting.type}</p>
                    </div>
                  </div>
                  <input
                    type={setting.type === 'number' ? 'number' : setting.type === 'boolean' ? 'checkbox' : 'text'}
                    checked={setting.type === 'boolean' ? setting.value === 'true' : undefined}
                    value={setting.type !== 'boolean' ? setting.value : undefined}
                    onChange={(e) => {
                      const newValue = setting.type === 'boolean' ? (e.target.checked ? 'true' : 'false') : e.target.value;
                      setCliSettings(cliSettings.map(s => s.id === setting.id ? { ...s, value: newValue } : s));
                    }}
                    className={`px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 ${setting.type === 'boolean' ? 'w-6' : 'w-24'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">CLI Tool Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Install via npm, yarn, or Homebrew</li>
              <li>• Memory CRUD operations from command line</li>
              <li>• Search and filter memories</li>
              <li>• File upload support</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
