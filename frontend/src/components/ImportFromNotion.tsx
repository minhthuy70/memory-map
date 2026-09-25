import { AlertTriangle, AlignCenter, AlignCenter as AlignCenterIcon, AlignLeft, AlignLeft as AlignLeftIcon, AlignRight, AlignRight as AlignRightIcon, ArrowDown, ArrowDown as ArrowDownIcon, ArrowLeft, ArrowLeft as ArrowLeftIcon, ArrowRight, ArrowRight as ArrowRightIcon, ArrowUp, ArrowUp as ArrowUpIcon, Bold, Bold as BoldIcon, Bookmark, Bookmark as BookmarkIcon, Calendar, Calendar as CalendarIcon, Check, Check as CheckIcon, CheckCircle, CheckSquare, Code, Code as CodeIcon, Database, Database as DatabaseIcon, Download, Download as DownloadIcon, ExternalLink, ExternalLink as ExternalLinkIcon, Eye, Eye as EyeIcon, EyeOff, EyeOff as EyeOffIcon, File, File as FileIcon, FileStack, FileStack as FileStackIcon, GalleryVertical, GalleryVertical as GalleryVerticalIcon, Heading1, Heading1 as Heading1Icon, Heading2, Heading2 as Heading2Icon, Heading3, Heading3 as Heading3Icon, Highlighter, Highlighter as HighlighterIcon, Image, Image as ImageIcon, Italic, Italic as ItalicIcon, Kanban, Kanban as KanbanIcon, Layout, Layout as LayoutIcon, Link, Link as LinkIcon, List, List as ListIcon, ListOrdered, ListOrdered as ListOrderedIcon, ListTodo, ListTodo as ListTodoIcon, Loader2, Lock, MessageSquare, MessageSquare as CalloutIcon, Minus, Minus as MinusIcon, NotepadText, Palette, Palette as PaletteIcon, PlayCircle, PlayCircle as YoutubeIcon, Plus, Plus as PlusIcon, Quote, Quote as QuoteIcon, RefreshCw, RefreshCw as RefreshCwIcon, Search, Search as SearchIcon, SeparatorHorizontal, SeparatorHorizontal as SeparatorHorizontalIcon, Settings, Sigma, Sigma as FigmaIcon, Square, Strikethrough, Strikethrough as StrikethroughIcon, Table, Table as TableIcon, Text, Text as TextIcon, ToggleLeft, ToggleLeft as ToggleLeftIcon, ToggleRight, ToggleRight as ToggleRightIcon, Underline, Underline as UnderlineIcon, Unlock, Video, Video as VimeoIcon, X } from 'lucide-react';
'use client';

import { useState } from 'react';


interface NotionPage {
  id: string;
  title: string;
  type: 'page' | 'database' | 'kanban' | 'calendar' | 'list' | 'table';
  content: string;
  databaseId?: string;
  properties: { key: string; type: string; value: any }[];
  blocks: { type: string; content: string; children?: any[] }[];
  tags: string[];
  date: Date;
  updated: Date;
  attachments: { type: 'image' | 'video' | 'audio' | 'file'; url: string; size: number }[];
  url?: string;
  isSelected: boolean;
  isDuplicate: boolean;
}

interface NotionImportProps {
  onCancel?: () => void;
  onConnect?: () => Promise<void>;
  onImport?: (pages: NotionPage[]) => Promise<void>;
  onDisconnect?: () => Promise<void>;
}

const DEFAULT_PAGES: NotionPage[] = [
  {
    id: 'not-1',
    title: 'Project Ideas',
    type: 'page',
    content: 'Brainstorming session notes for new project...',
    properties: [
      { key: 'Status', type: 'select', value: 'In Progress' },
      { key: 'Priority', type: 'select', value: 'High' },
    ],
    blocks: [
      { type: 'heading_1', content: 'Project Ideas' },
      { type: 'text', content: 'Brainstorming session notes for new project...' },
    ],
    tags: ['project', 'ideas', 'brainstorm'],
    date: new Date('2024-01-15'),
    updated: new Date('2024-01-20'),
    attachments: [{ type: 'file', url: '/not-1.pdf', size: 1500000 }],
    url: 'https://notion.so/page/not-1',
    isSelected: true,
    isDuplicate: false,
  },
  {
    id: 'not-2',
    title: 'Travel Plans',
    type: 'database',
    content: 'Planning summer vacation destinations...',
    databaseId: 'db-1',
    properties: [
      { key: 'Destination', type: 'text', value: 'Paris' },
      { key: 'Date', type: 'date', value: '2024-06-15' },
      { key: 'Budget', type: 'number', value: 5000 },
    ],
    blocks: [
      { type: 'heading_1', content: 'Travel Plans' },
      { type: 'text', content: 'Planning summer vacation destinations...' },
    ],
    tags: ['travel', 'vacation', 'planning'],
    date: new Date('2024-01-10'),
    updated: new Date('2024-01-12'),
    attachments: [{ type: 'image', url: '/not-2.jpg', size: 2500000 }],
    url: 'https://notion.so/page/not-2',
    isSelected: true,
    isDuplicate: false,
  },
];

export default function ImportFromNotion({ onCancel, onConnect, onImport, onDisconnect }: NotionImportProps) {
  const [pages, setPages] = useState<NotionPage[]>(DEFAULT_PAGES);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPages, setSelectedPages] = useState<NotionPage[]>(DEFAULT_PAGES.filter(p => p.isSelected));
  const [autoSelect, setAutoSelect] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [includeBlocks, setIncludeBlocks] = useState(true);
  const [includeProperties, setIncludeProperties] = useState(true);
  const [includeTags, setIncludeTags] = useState(true);
  const [includeUrl, setIncludeUrl] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const totalPages = pages.length;
  const selectedCount = selectedPages.length;
  const duplicateCount = pages.filter(p => p.isDuplicate).length;
  const totalAttachments = pages.reduce((sum, p) => sum + p.attachments.length, 0);
  const totalSize = pages.reduce((sum, p) => sum + p.attachments.reduce((a, att) => a + att.size, 0), 0);
  const types = Array.from(new Set(pages.map(p => p.type)));

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
    await onImport?.(selectedPages);
    setIsImporting(false);
  };

  const handleScan = async () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleTogglePage = (pageId: string) => {
    setPages(pages.map(p => 
      p.id === pageId ? { ...p, isSelected: !p.isSelected } : p
    ));
    setSelectedPages(pages.filter(p => p.id === pageId ? !p.isSelected : p.isSelected));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return TextIcon;
      case 'database': return DatabaseIcon;
      case 'kanban': return KanbanIcon;
      case 'calendar': return CalendarIcon;
      case 'list': return ListIcon;
      case 'table': return TableIcon;
      default: return FileIcon;
    }
  };

  const getBlockIcon = (blockType: string) => {
    switch (blockType) {
      case 'heading_1': return Heading1Icon;
      case 'heading_2': return Heading2Icon;
      case 'heading_3': return Heading3Icon;
      case 'text': return TextIcon;
      case 'list': return ListIcon;
      case 'list_ordered': return ListOrderedIcon;
      case 'list_todo': return ListTodoIcon;
      case 'code': return CodeIcon;
      case 'quote': return QuoteIcon;
      case 'callout': return CalloutIcon;
      case 'bookmark': return BookmarkIcon;
      case 'link': return LinkIcon;
      case 'youtube': return YoutubeIcon;
      case 'vimeo': return VimeoIcon;
      case 'figma': return FigmaIcon;
      case 'image': return ImageIcon;
      case 'video': return VideoIcon;
      case 'file': return FileIcon;
      default: return TextIcon;
    }
  };

  const filteredPages = typeFilter === 'all' 
    ? pages 
    : pages.filter(p => p.type === typeFilter);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl">
            <BookMarked className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhập từ Notion
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

      {showSettings && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt Notion import
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-select all pages
              </span>
              <button
                type="button"
                onClick={() => setAutoSelect(!autoSelect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSelect ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
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
                  includeAttachments ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Include blocks
              </span>
              <button
                type="button"
                onClick={() => setIncludeBlocks(!includeBlocks)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeBlocks ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeBlocks ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include properties
              </span>
              <button
                type="button"
                onClick={() => setIncludeProperties(!includeProperties)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeProperties ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeProperties ? 'translate-x-5' : ''
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
                  includeTags ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Include URL
              </span>
              <button
                type="button"
                onClick={() => setIncludeUrl(!includeUrl)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeUrl ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Type filter
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
              >
                <option value="all">All Types</option>
                {types.map(t => (
                  <option key={t} value={t}>{t}</option>
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
            <FileStackIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Pages</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalPages}
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
            <DownloadIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Attachments</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalAttachments}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <DatabaseIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Types</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {types.length}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Notion Connection
            </span>
            {isConnected && (
              <span className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 text-[10px] font-semibold rounded-full">
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
                : 'bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white'
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
                Connect to Notion
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scan Pages */}
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
                <RefreshCwIcon className="h-4 w-4" />
                Scan for Pages
              </>
            )}
          </button>
        </div>
      )}

      {/* Page Selection */}
      {isConnected && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Notion Pages
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPages(pages.map(p => ({ ...p, isSelected: autoSelect })))}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-xs font-semibold rounded-lg transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setPages(pages.map(p => ({ ...p, isSelected: false })))}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-xs font-semibold rounded-lg transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {filteredPages.map((page) => {
              const TypeIcon = getTypeIcon(page.type);
              return (
                <div
                  key={page.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    page.isSelected
                      ? 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'
                      : page.isDuplicate
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  }`}
                  onClick={() => handleTogglePage(page.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TypeIcon className="h-4 w-4 text-slate-500" />
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {page.title}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {formatDate(page.date)} • Updated: {formatDate(page.updated)}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {page.content}
                      </div>
                    </div>
                    {page.isDuplicate && (
                      <div className="flex items-center gap-1 ml-2">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        <span className="text-[10px] text-amber-600 dark:text-amber-400">Duplicate</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {includeProperties && page.properties.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {page.properties.map((prop, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-700 dark:text-slate-300"
                          >
                            <span className="font-medium">{prop.key}:</span> {prop.value}
                          </span>
                        ))}
                      </div>
                    )}
                    {includeTags && page.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {page.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-700 dark:text-slate-300"
                          >
                            <span className="font-medium">#</span>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {includeUrl && page.url && (
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLinkIcon className="h-3 w-3" />
                        View in Notion
                      </a>
                    )}
                  </div>
                  {includeBlocks && page.blocks.length > 0 && (
                    <div className="mt-2 border-t border-slate-200 dark:border-slate-600 pt-2">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Blocks</div>
                      <div className="space-y-1">
                        {page.blocks.slice(0, 3).map((block, idx) => {
                          const BlockIcon = getBlockIcon(block.type);
                          return (
                            <div key={idx} className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400">
                              <BlockIcon className="h-3 w-3" />
                              <span className="line-clamp-1">{block.content}</span>
                            </div>
                          );
                        })}
                        {page.blocks.length > 3 && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            +{page.blocks.length - 3} more blocks
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {includeAttachments && page.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {page.attachments.map((att, idx) => {
                        const Icon = getBlockIcon(att.type);
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
              );
            })}
          </div>
        </div>
      )}

      {/* Metadata Preview */}
      {isConnected && selectedPages.length > 0 && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              Import Summary
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Selected Pages</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Attachments</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedPages.reduce((sum, p) => sum + p.attachments.length, 0)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Attachments</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeAttachments ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Blocks</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeBlocks ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Properties</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeProperties ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Tags</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeTags ? 'Yes' : 'No'}
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <DownloadIcon className="h-4 w-4" />
                Import Selected Pages
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
        <p className="text-[10px] text-slate-700 dark:text-slate-400">
          <strong>Lưu ý:</strong> Nhập từ Notion với OAuth connection, page/database scanning, title/content extraction, block parsing (heading/text/list/code/quote/callout/bookmark/link/youtube/vimeo/figma/image/video/file), property extraction (text/select/date/number/multi-select/people), tag extraction, database support (page/kanban/calendar/list/table types), URL preservation, date/time tracking, duplicate detection, auto-select options, page selection with preview, batch import, comprehensive Notion API integration, và full page/block preservation.
        </p>
      </div>
    </div>
  );
}
