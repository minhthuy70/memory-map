'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Database,
  FileText,
  Filter,
  FolderOpen,
  Layers,
  Loader2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Settings,
  SkipForward,
  Sparkles,
  Trash2,
  Upload,
  Zap
} from 'lucide-react';

interface BulkImportWizardProps {
  onCancel?: () => void;
  onComplete?: () => void;
}

interface ImportSource {
  id: string;
  name: string;
  icon: any;
  files: File[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface ImportStep {
  id: string;
  title: string;
  description: string;
}

const STEPS: ImportStep[] = [
  { id: 'select-sources', title: 'Select Sources', description: 'Choose import sources and files' },
  { id: 'configure', title: 'Configure', description: 'Set import options and preferences' },
  { id: 'preview', title: 'Preview', description: 'Review import settings' },
  { id: 'import', title: 'Import', description: 'Import your memories' },
];

const AVAILABLE_SOURCES = [
  { id: 'google-photos', name: 'Google Photos', icon: FileText },
  { id: 'apple-photos', name: 'Apple Photos', icon: FileText },
  { id: 'instagram', name: 'ImagePlus', icon: FileText },
  { id: 'facebook', name: 'Globe2', icon: FileText },
  { id: 'daylio', name: 'Daylio', icon: FileText },
  { id: 'day-one', name: 'Day One', icon: FileText },
  { id: 'evernote', name: 'Evernote', icon: FileText },
  { id: 'notion', name: 'BookMarked', icon: FileText },
  { id: 'csv', name: 'CSV Template', icon: FileText },
  { id: 'gpx', name: 'GPX Track', icon: FileText },
];

export default function BulkImportWizard({ onCancel, onComplete }: BulkImportWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSources, setSelectedSources] = useState<ImportSource[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [processedFiles, setProcessedFiles] = useState(0);
  const [showSourceDetails, setShowSourceDetails] = useState(false);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState<number | null>(null);
  const [autoCategorize, setAutoCategorize] = useState(true);
  const [autoTag, setAutoTag] = useState(true);
  const [detectDuplicates, setDetectDuplicates] = useState(true);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [importMode, setImportMode] = useState<'batch' | 'parallel' | 'sequential'>('batch');
  const [maxParallel, setMaxParallel] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleAddSource = (sourceId: string) => {
    const source = AVAILABLE_SOURCES.find(s => s.id === sourceId);
    if (source && !selectedSources.find(s => s.id === sourceId)) {
      setSelectedSources([
        ...selectedSources,
        {
          id: sourceId,
          name: source.name,
          icon: source.icon,
          files: [],
          status: 'pending',
          progress: 0,
        },
      ]);
    }
  };

  const handleRemoveSource = (sourceId: string) => {
    setSelectedSources(selectedSources.filter(s => s.id !== sourceId));
  };

  const handleFileUpload = (sourceId: string, files: FileList | null) => {
    if (files) {
      setSelectedSources(
        selectedSources.map(s =>
          s.id === sourceId
            ? { ...s, files: [...s.files, ...Array.from(files)] }
            : s
        )
      );
    }
  };

  const handleRemoveFile = (sourceId: string, fileIndex: number) => {
    setSelectedSources(
      selectedSources.map(s =>
        s.id === sourceId
          ? { ...s, files: s.files.filter((_, i) => i !== fileIndex) }
          : s
      )
    );
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartImport = async () => {
    setIsImporting(true);
    setShowSummary(true);
    setStartTime(Date.now());
    setError(null);
    setTotalFiles(selectedSources.reduce((sum, s) => sum + s.files.length, 0));
    setProcessedFiles(0);

    const interval = setInterval(() => {
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    for (let i = 0; i < selectedSources.length; i++) {
      const source = selectedSources[i];
      setSelectedSources(
        selectedSources.map((s, idx) =>
          idx === i ? { ...s, status: 'processing' } : s
        )
      );

      for (let j = 0; j < source.files.length; j++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const progress = ((j + 1) / source.files.length) * 100;
        setSelectedSources(
          selectedSources.map((s, idx) =>
            idx === i ? { ...s, progress } : s
          )
        );
        setProcessedFiles(prev => prev + 1);
        setGlobalProgress((processedFiles + j + 1) / totalFiles * 100);
      }

      setSelectedSources(
        selectedSources.map((s, idx) =>
          idx === i ? { ...s, status: 'completed', progress: 100 } : s
        )
      );
    }

    clearInterval(interval);
    setIsImporting(false);
    setTimeout(() => {
      onComplete?.();
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'select-sources':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_SOURCES.map(source => {
                const Icon = source.icon;
                const isSelected = selectedSources.find(s => s.id === source.id);
                return (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => isSelected ? handleRemoveSource(source.id) : handleAddSource(source.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {source.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedSources.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
                  Selected Sources ({selectedSources.length})
                </h4>
                <div className="space-y-2">
                  {selectedSources.map((source, idx) => {
                    const Icon = source.icon;
                    return (
                      <div
                        key={source.id}
                        className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {source.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSource(source.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </button>
                        </div>
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-3 text-center">
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileUpload(source.id, e.target.files)}
                            className="hidden"
                            id={`file-upload-${source.id}`}
                          />
                          <label
                            htmlFor={`file-upload-${source.id}`}
                            className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            {source.files.length > 0 ? 'Add more files' : 'Upload files'}
                          </label>
                          {source.files.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {source.files.map((file, fileIdx) => (
                                <div
                                  key={fileIdx}
                                  className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs"
                                >
                                  <FileText className="h-3 w-3 text-slate-500" />
                                  <span className="text-slate-600 dark:text-slate-400 truncate max-w-32">
                                    {file.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(source.id, fileIdx)}
                                    className="hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'configure':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
                Import Options
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                    Import mode
                  </label>
                  <select
                    value={importMode}
                    onChange={(e) => setImportMode(e.target.value as any)}
                    className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                  >
                    <option value="batch">Batch (process all at once)</option>
                    <option value="parallel">Parallel (multiple concurrent)</option>
                    <option value="sequential">Sequential (one by one)</option>
                  </select>
                </div>
                {importMode === 'parallel' && (
                  <div>
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      Max parallel imports
                    </label>
                    <input
                      type="number"
                      value={maxParallel}
                      onChange={(e) => setMaxParallel(parseInt(e.target.value) || 3)}
                      min="1"
                      max="10"
                      className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Auto-categorize memories
                  </span>
                  <button
                    type="button"
                    onClick={() => setAutoCategorize(!autoCategorize)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      autoCategorize ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        autoCategorize ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Auto-tag memories
                  </span>
                  <button
                    type="button"
                    onClick={() => setAutoTag(!autoTag)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      autoTag ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        autoTag ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Detect duplicates
                  </span>
                  <button
                    type="button"
                    onClick={() => setDetectDuplicates(!detectDuplicates)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      detectDuplicates ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        detectDuplicates ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
                {detectDuplicates && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Skip duplicates
                    </span>
                    <button
                      type="button"
                      onClick={() => setSkipDuplicates(!skipDuplicates)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        skipDuplicates ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          skipDuplicates ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
                Import Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Sources:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">
                    {selectedSources.length}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Total files:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">
                    {selectedSources.reduce((sum, s) => sum + s.files.length, 0)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Import mode:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
                    {importMode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Auto-categorize:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">
                    {autoCategorize ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
                Sources Breakdown
              </h4>
              <div className="space-y-2">
                {selectedSources.map((source, idx) => {
                  const Icon = source.icon;
                  return (
                    <div
                      key={source.id}
                      className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-900 dark:text-white">
                          {source.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {source.files.length} files
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'import':
        return (
          <div className="space-y-4">
            {showSummary && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Import Progress
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(elapsedTime)}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${globalProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>{processedFiles} / {totalFiles} files</span>
                  <span>{globalProgress.toFixed(0)}%</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {selectedSources.map((source, idx) => {
                const Icon = source.icon;
                return (
                  <div
                    key={source.id}
                    className={`p-3 rounded-lg border ${
                      source.status === 'completed'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : source.status === 'processing'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : source.status === 'error'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {source.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {source.status === 'processing' && (
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        )}
                        {source.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {source.status === 'error' && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {source.progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          source.status === 'completed'
                            ? 'bg-green-500'
                            : source.status === 'processing'
                            ? 'bg-blue-500'
                            : source.status === 'error'
                            ? 'bg-red-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${source.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {!isImporting && globalProgress === 100 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Import completed successfully!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {processedFiles} files imported in {formatTime(elapsedTime)}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Bulk Import Wizard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Import from multiple sources at once
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
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

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6 px-4">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  idx === currentStep
                    ? 'bg-purple-500 text-white'
                    : idx < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                }`}
              >
                {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={`text-xs mt-1 ${
                  idx === currentStep
                    ? 'text-purple-500 font-medium'
                    : idx < currentStep
                    ? 'text-green-500'
                    : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-2 ${
                  idx < currentStep ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {getStepContent()}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {currentStep === STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleStartImport}
            disabled={isImporting || selectedSources.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Start Import
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={
              (currentStep === 0 && selectedSources.length === 0) ||
              (currentStep === 0 && selectedSources.every(s => s.files.length === 0))
            }
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
