'use client';

import { useState } from 'react';
import { Download, X, RefreshCw, Info, CheckCircle, Star, Zap, FileText, HardDrive, Archive, CheckSquare } from 'lucide-react';

interface SelfHostedDataExportProps {
  onCancel?: () => void;
}

interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
  icon: string;
  isEnabled: boolean;
}

interface ExportRecord {
  id: string;
  format: string;
  fileSize: number;
  itemCount: number;
  exportedAt: string;
  status: 'completed' | 'processing' | 'failed';
  downloadUrl: string;
}

interface DataCategory {
  id: string;
  name: string;
  count: number;
  size: number;
  isSelected: boolean;
}

export default function SelfHostedDataExport({ onCancel }: SelfHostedDataExportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isExportEnabled, setIsExportEnabled] = useState(true);

  const [exportFormats, setExportFormats] = useState<ExportFormat[]>([
    { id: '1', name: 'JSON', extension: '.json', description: 'Structured data format', icon: '{ }', isEnabled: true },
    { id: '2', name: 'CSV', extension: '.csv', description: 'Spreadsheet compatible', icon: '📊', isEnabled: true },
    { id: '3', name: 'ZIP Archive', extension: '.zip', description: 'Compressed all files', icon: '📦', isEnabled: true },
    { id: '4', name: 'SQLite', extension: '.db', description: 'Database file', icon: '🗄️', isEnabled: false },
  ]);

  const [exportRecords, setExportRecords] = useState<ExportRecord[]>([
    { id: '1', format: 'JSON', fileSize: 15.5, itemCount: 245, exportedAt: '2024-01-15', status: 'completed', downloadUrl: '/exports/data_2024-01-15.json' },
    { id: '2', format: 'CSV', fileSize: 8.2, itemCount: 245, exportedAt: '2024-02-20', status: 'completed', downloadUrl: '/exports/data_2024-02-20.csv' },
    { id: '3', format: 'ZIP', fileSize: 45.8, itemCount: 245, exportedAt: '2024-03-10', status: 'completed', downloadUrl: '/exports/data_2024-03-10.zip' },
  ]);

  const [dataCategories, setDataCategories] = useState<DataCategory[]>([
    { id: '1', name: 'Memories', count: 150, size: 500, isSelected: true },
    { id: '2', name: 'Photos', count: 300, size: 2000, isSelected: true },
    { id: '3', name: 'Videos', count: 25, size: 5000, isSelected: true },
    { id: '4', name: 'Comments', count: 450, size: 5, isSelected: false },
    { id: '5', name: 'Settings', count: 1, size: 0.1, isSelected: true },
  ]);

  const toggleFormat = (id: string) => {
    setExportFormats(exportFormats.map(format => 
      format.id === id ? { ...format, isEnabled: !format.isEnabled } : format
    ));
  };

  const toggleCategory = (id: string) => {
    setDataCategories(dataCategories.map(category => 
      category.id === id ? { ...category, isSelected: !category.isSelected } : category
    ));
  };

  const selectAllCategories = () => {
    setDataCategories(dataCategories.map(category => ({ ...category, isSelected: true })));
  };

  const deselectAllCategories = () => {
    setDataCategories(dataCategories.map(category => ({ ...category, isSelected: false })));
  };

  const exportData = (format: string) => {
    const selectedCategories = dataCategories.filter(c => c.isSelected);
    const totalSize = selectedCategories.reduce((acc, c) => acc + c.size, 0);
    const totalItems = selectedCategories.reduce((acc, c) => acc + c.count, 0);

    const newRecord: ExportRecord = {
      id: Date.now().toString(),
      format,
      fileSize: totalSize,
      itemCount: totalItems,
      exportedAt: new Date().toISOString().split('T')[0],
      status: 'completed',
      downloadUrl: `/exports/data_${Date.now()}.${format.toLowerCase()}`,
    };
    setExportRecords([...exportRecords, newRecord]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'JSON': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'CSV': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'ZIP': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'SQLite': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Self-hosted Data Export
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export all data for self-hosting
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isExportEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isExportEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Exports</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{exportRecords.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Data Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{dataCategories.reduce((acc, c) => acc + c.size, 0).toFixed(1)} MB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Items</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{dataCategories.reduce((acc, c) => acc + c.count, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Formats</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{exportFormats.filter(f => f.isEnabled).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isExportEnabled}
              onChange={(e) => setIsExportEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Export</span>
          </div>
          <button
            type="button"
            onClick={selectAllCategories}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <CheckSquare className="h-3 w-3" />
            Select All
          </button>
          <button
            type="button"
            onClick={deselectAllCategories}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            Deselect All
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Data Categories</h4>
          <div className="space-y-2">
            {dataCategories.map((category) => (
              <div key={category.id} className={`p-3 rounded-lg border ${category.isSelected ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={category.isSelected}
                      onChange={() => toggleCategory(category.id)}
                      className="rounded"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{category.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {category.count} items • {category.size.toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <FileText className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Export Formats</h4>
          <div className="space-y-2">
            {exportFormats.map((format) => (
              <div key={format.id} className={`p-3 rounded-lg border ${format.isEnabled ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{format.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{format.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{format.extension}</span>
                        {format.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{format.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFormat(format.id)}
                    className={`px-2 py-1 rounded text-xs ${format.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {format.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
                {format.isEnabled && (
                  <button
                    type="button"
                    onClick={() => exportData(format.name)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Export as {format.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Export History</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {exportRecords.map((record) => (
              <div key={record.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Archive className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${getFormatColor(record.format)}`}>
                          {record.format}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {record.itemCount} items • {record.fileSize.toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{record.exportedAt}</p>
                  </div>
                </div>
                {record.status === 'completed' && (
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Data Export Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Export data in multiple formats (JSON, CSV, ZIP, SQLite)</li>
              <li>• Select specific data categories to export</li>
              <li>• Export history tracks all previous exports</li>
              <li>• Download exported files for self-hosting</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
