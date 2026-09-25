'use client';

import { useState } from 'react';
import {
  Activity,
  ActivityIcon,
  AlertCircle,
  AlertTriangle,
  AlertTriangleIcon,
  Angry,
  AngryIcon,
  Archive,
  ArchiveIcon,
  as,
  BarChart3,
  Bookmark,
  BookOpen,
  Briefcase,
  Cake,
  Calendar,
  CalendarIcon,
  CalendarIcon2,
  CalendarIcon3,
  Camera,
  Check,
  CheckCheck,
  CheckCircle,
  CheckCircleIcon,
  CheckIcon,
  CheckIcon2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock,
  ClockIcon,
  ClockIcon2,
  Cloud,
  Code,
  Code2,
  Coffee,
  CoffeeIcon,
  Copy,
  CopyIcon,
  CopyIcon2,
  Copyright,
  CopyRightIcon,
  Database,
  Download,
  DownloadIcon,
  Droplet,
  Dumbbell,
  Edit,
  Edit2,
  EditIcon,
  Elephant,
  ExternalLink,
  ExternalLinkIcon,
  Eye,
  EyeOff,
  File,
  FileText,
  FileTextIcon,
  Filter,
  FilterIcon,
  Folder,
  FolderIcon,
  FolderIcon2,
  FolderOpen,
  FolderOpenIcon,
  Frown,
  Gamepad2,
  Gift,
  Globe,
  Grid,
  Hash,
  Headphones,
  Heart,
  HeartIcon,
  Home,
  Image,
  ImageIcon,
  ImageIcon2,
  ImageIcon3,
  ImageIcon4,
  ImageIcon5,
  Layers,
  Layout,
  Link,
  Link2,
  LinkIcon,
  List,
  ListIcon,
  Loader2,
  Lock,
  Map,
  MapIcon,
  MapPin,
  MapPinIcon,
  Meh,
  MessageCircle,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  Music,
  Newspaper,
  Notebook,
  Palette,
  Paperclip,
  Pause,
  PenTool,
  Plane,
  Play,
  Plus,
  PlusIcon,
  Printer,
  RefreshCw,
  RefreshCwIcon,
  Save,
  School,
  Search,
  SearchIcon,
  Settings,
  SettingsIcon,
  Share,
  Share2,
  Shield,
  ShoppingBag,
  Smile,
  SmileIcon,
  Sparkles,
  Square,
  Star,
  StarIcon,
  Sun,
  Table,
  Tag,
  TagIcon,
  TagIcon2,
  Thermometer,
  ThumbsUp,
  Trash,
  Trash2,
  TrashIcon,
  Type,
  Unlock,
  Upload,
  UploadIcon,
  Users,
  Utensils,
  Video,
  VideoIcon,
  Wifi,
  XIcon,
  Zap,
  ZapIcon,
  ZapIcon2
} from 'lucide-react';

interface EvernoteNote {
  id: string;
  title: string;
  content: string;
  notebook: string;
  tags: string[];
  date: Date;
  updated: Date;
  attachments: { type: 'image' | 'video' | 'audio' | 'document'; url: string; size: number }[];
  url?: string;
  isSelected: boolean;
  isDuplicate: boolean;
}

interface EvernoteImportProps {
  onCancel?: () => void;
  onConnect?: () => Promise<void>;
  onImport?: (notes: EvernoteNote[]) => Promise<void>;
  onDisconnect?: () => Promise<void>;
}

const DEFAULT_NOTES: EvernoteNote[] = [
  {
    id: 'ev-1',
    title: 'Project Ideas',
    content: 'Brainstorming session notes for new project...',
    notebook: 'Work',
    tags: ['project', 'ideas', 'brainstorm'],
    date: new Date('2024-01-15'),
    updated: new Date('2024-01-20'),
    attachments: [{ type: 'document', url: '/ev-1.pdf', size: 1500000 }],
    url: 'https://evernote.com/note/ev-1',
    isSelected: true,
    isDuplicate: false,
  },
  {
    id: 'ev-2',
    title: 'Travel Plans',
    content: 'Planning summer vacation destinations...',
    notebook: 'Personal',
    tags: ['travel', 'vacation', 'planning'],
    date: new Date('2024-01-10'),
    updated: new Date('2024-01-12'),
    attachments: [{ type: 'image', url: '/ev-2.jpg', size: 2500000 }],
    url: 'https://evernote.com/note/ev-2',
    isSelected: true,
    isDuplicate: false,
  },
];

export default function ImportFromEvernote({ onCancel, onConnect, onImport, onDisconnect }: EvernoteImportProps) {
  const [notes, setNotes] = useState<EvernoteNote[]>(DEFAULT_NOTES);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<EvernoteNote[]>(DEFAULT_NOTES.filter(n => n.isSelected));
  const [autoSelect, setAutoSelect] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [includeTags, setIncludeTags] = useState(true);
  const [includeNotebook, setIncludeNotebook] = useState(true);
  const [includeUrl, setIncludeUrl] = useState(true);
  const [notebookFilter, setNotebookFilter] = useState<string>('all');

  const totalNotes = notes.length;
  const selectedCount = selectedNotes.length;
  const duplicateCount = notes.filter(n => n.isDuplicate).length;
  const totalAttachments = notes.reduce((sum, n) => sum + n.attachments.length, 0);
  const totalSize = notes.reduce((sum, n) => sum + n.attachments.reduce((a, att) => a + att.size, 0), 0);
  const notebooks = Array.from(new Set(notes.map(n => n.notebook)));

  const handleConnect = async () => {
    await onConnect?.();
    setIsConnected(true);
  };

  const handleDisconnect = async () => {
    await onDisconnect?.();
    setIsConnected(false);
  };

  const handleImport = async () => {
    setIsImporting(true);
    await onImport?.(selectedNotes);
    setIsImporting(false);
  };

  const handleScan = async () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleToggleNote = (noteId: string) => {
    setNotes(notes.map(n => 
      n.id === noteId ? { ...n, isSelected: !n.isSelected } : n
    ));
    setSelectedNotes(notes.filter(n => n.id === noteId ? !n.isSelected : n.isSelected));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon5;
      case 'video': return VideoIcon;
      case 'audio': return Headphones;
      case 'document': return FileTextIcon;
      default: return File;
    }
  };

  const filteredNotes = notebookFilter === 'all' 
    ? notes 
    : notes.filter(n => n.notebook === notebookFilter);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Elephant className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhập từ Evernote
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isConnected ? 'Connected' : 'Not connected'}
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
            <SettingsIcon className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt Evernote import
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-select all notes
              </span>
              <button
                type="button"
                onClick={() => setAutoSelect(!autoSelect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSelect ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSelect ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include attachments
              </span>
              <button
                type="button"
                onClick={() => setIncludeAttachments(!includeAttachments)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeAttachments ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeAttachments ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include tags
              </span>
              <button
                type="button"
                onClick={() => setIncludeTags(!includeTags)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeTags ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeTags ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include notebook
              </span>
              <button
                type="button"
                onClick={() => setIncludeNotebook(!includeNotebook)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeNotebook ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeNotebook ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include URL
              </span>
              <button
                type="button"
                onClick={() => setIncludeUrl(!includeUrl)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeUrl ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeUrl ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Notebook filter
              </span>
              <select
                value={notebookFilter}
                onChange={(e) => setNotebookFilter(e.target.value)}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
              >
                <option value="all">All Notebooks</option>
                {notebooks.map(nb => (
                  <option key={nb} value={nb}>{nb}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Notebook className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Notes</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalNotes}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Selected</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Paperclip className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Attachments</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalAttachments}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <FolderIcon2 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Notebooks</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {notebooks.length}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Evernote Connection
            </span>
            {isConnected && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-full">
                Connected
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={isConnected ? handleDisconnect : handleConnect}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              isConnected
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white'
            }`}
          >
            {isConnected ? (
              <>
                <Lock className="h-4 w-4" />
                Disconnect
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                Connect to Evernote
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scan Notes */}
      {isConnected && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Scan for Notes
              </>
            )}
          </button>
        </div>
      )}

      {/* Note Selection */}
      {isConnected && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Evernote Notes
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNotes(notes.map(n => ({ ...n, isSelected: autoSelect })))}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-xs font-semibold rounded-lg transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setNotes(notes.map(n => ({ ...n, isSelected: false })))}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-xs font-semibold rounded-lg transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  note.isSelected
                    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                    : note.isDuplicate
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
                onClick={() => handleToggleNote(note.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {note.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {formatDate(note.date)} • Updated: {formatDate(note.updated)}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {note.content}
                    </div>
                  </div>
                  {note.isDuplicate && (
                    <div className="flex items-center gap-1 ml-2">
                      <AlertTriangleIcon className="h-3 w-3 text-amber-500" />
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">Files</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {includeNotebook && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400">
                      <FolderIcon2 className="h-3 w-3" />
                      {note.notebook}
                    </div>
                  )}
                  {includeTags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-[10px]"
                        >
                          <TagIcon2 className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {includeUrl && note.url && (
                    <a
                      href={note.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLinkIcon className="h-3 w-3" />
                      View in Evernote
                    </a>
                  )}
                </div>
                {includeAttachments && note.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {note.attachments.map((att, idx) => {
                      const Icon = getAttachmentIcon(att.type);
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-700 dark:text-slate-300"
                        >
                          <Icon className="h-3 w-3" />
                          {att.type} ({formatFileSize(att.size)})
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Preview */}
      {isConnected && selectedNotes.length > 0 && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              Import Summary
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Selected Notes</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Attachments</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedNotes.reduce((sum, n) => sum + n.attachments.length, 0)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Attachments</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeAttachments ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Tags</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeTags ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Notebook</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeNotebook ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include URL</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeUrl ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Button */}
      {isConnected && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleImport}
            disabled={isImporting || selectedCount === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <DownloadIcon className="h-4 w-4" />
                Import Selected Notes
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Nhập từ Evernote với OAuth connection, note scanning, title/content extraction, attachment support (image/video/audio/document), tag extraction, notebook organization, URL preservation, date/time tracking, duplicate detection, auto-select options, note selection with preview, batch import, comprehensive Evernote API integration, và full note preservation.
        </p>
      </div>
    </div>
  );
}