'use client';

import { useState } from 'react';
import { Trash2, X, Settings, RefreshCw, CheckCircle, AlertTriangle, FileText, Clock, Shield, Check, Ban, Download, AlertCircle, User, Mail, File, Plus } from 'lucide-react';

interface DeletionRequest {
  id: string;
  requestId: string;
  userId: string;
  requestDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  dataTypes: string[];
  reason: string;
  completionDate: Date | null;
  verified: boolean;
}

interface DeletionLog {
  id: string;
  dataType: string;
  recordCount: number;
  size: string;
  deletedAt: Date;
  status: 'success' | 'failed';
}

interface RightToBeForgottenProps {
  onCancel?: () => void;
  onSubmitRequest?: (request: Omit<DeletionRequest, 'id' | 'requestId' | 'requestDate'>) => Promise<DeletionRequest>;
  onCancelRequest?: (requestId: string) => Promise<void>;
  onVerifyRequest?: (requestId: string) => Promise<void>;
}

const DEFAULT_REQUESTS: DeletionRequest[] = [
  {
    id: 'req-1',
    requestId: 'RTBF-2024-001',
    userId: 'user-123',
    requestDate: new Date(Date.now() - 86400000 * 2),
    status: 'completed',
    dataTypes: ['Personal Info', 'Session Data', 'Analytics'],
    reason: 'Account closure',
    completionDate: new Date(Date.now() - 86400000),
    verified: true,
  },
  {
    id: 'req-2',
    requestId: 'RTBF-2024-002',
    userId: 'user-456',
    requestDate: new Date(Date.now() - 86400000),
    status: 'processing',
    dataTypes: ['Personal Info', 'Memories', 'Location Data'],
    reason: 'Data privacy concern',
    completionDate: null,
    verified: true,
  },
  {
    id: 'req-3',
    requestId: 'RTBF-2024-003',
    userId: 'user-789',
    requestDate: new Date(),
    status: 'pending',
    dataTypes: ['All Data'],
    reason: 'Right to be forgotten',
    completionDate: null,
    verified: false,
  },
];

const DEFAULT_LOGS: DeletionLog[] = [
  {
    id: 'log-1',
    dataType: 'Personal Info',
    recordCount: 1250,
    size: '2.5 MB',
    deletedAt: new Date(Date.now() - 86400000),
    status: 'success',
  },
  {
    id: 'log-2',
    dataType: 'Memories',
    recordCount: 890,
    size: '15.2 GB',
    deletedAt: new Date(Date.now() - 86400000),
    status: 'success',
  },
  {
    id: 'log-3',
    dataType: 'Session Data',
    recordCount: 5420,
    size: '8.5 GB',
    deletedAt: new Date(Date.now() - 86400000),
    status: 'success',
  },
];

export default function RightToBeForgotten({ onCancel, onSubmitRequest, onCancelRequest, onVerifyRequest }: RightToBeForgottenProps) {
  const [requests, setRequests] = useState<DeletionRequest[]>(DEFAULT_REQUESTS);
  const [logs, setLogs] = useState<DeletionLog[]>(DEFAULT_LOGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'processing' | 'completed' | 'rejected'>('all');
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [reason, setReason] = useState('');

  const handleSubmitRequest = async () => {
    if (onSubmitRequest) {
      const newRequest = await onSubmitRequest({
        userId: 'current-user',
        status: 'pending',
        dataTypes: selectedDataTypes,
        reason,
        completionDate: null,
        verified: false,
      });
      setRequests(prev => [newRequest, ...prev]);
    } else {
      const newRequest: DeletionRequest = {
        id: `req-${Date.now()}`,
        requestId: `RTBF-2024-${(requests.length + 1).toString().padStart(3, '0')}`,
        userId: 'current-user',
        requestDate: new Date(),
        status: 'pending',
        dataTypes: selectedDataTypes,
        reason,
        completionDate: null,
        verified: false,
      };
      setRequests(prev => [newRequest, ...prev]);
    }
    setShowNewRequest(false);
    setSelectedDataTypes([]);
    setReason('');
  };

  const handleCancelRequest = async (requestId: string) => {
    if (onCancelRequest) {
      await onCancelRequest(requestId);
    }
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleVerifyRequest = async (requestId: string) => {
    if (onVerifyRequest) {
      await onVerifyRequest(requestId);
    }
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, verified: true } : req
    ));
  };

  const getStatusColor = (status: DeletionRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'from-amber-400 to-orange-500';
      case 'processing':
        return 'from-blue-400 to-cyan-500';
      case 'completed':
        return 'from-green-400 to-emerald-500';
      case 'rejected':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getStatusIcon = (status: DeletionRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <Ban className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredRequests = selectedStatus === 'all' 
    ? requests 
    : requests.filter(req => req.status === selectedStatus);

  const completedRequests = requests.filter(r => r.status === 'completed').length;
  const totalDeletedRecords = logs.reduce((sum, log) => sum + log.recordCount, 0);
  const totalDeletedSize = logs.reduce((sum, log) => sum + parseFloat(log.size), 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl">
            <Trash2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Quyền bị xóa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedRequests}/{requests.length} completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewRequest(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Tạo request mới"
          >
            <Plus className="h-4 w-4 text-slate-500" />
          </button>
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
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt Right to be Forgotten
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Legal compliance
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">GDPR Article 17</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Verification required
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Yes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Grace period
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">30 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-backup before deletion
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Requests</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {requests.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {completedRequests}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Trash2 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Records Deleted</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalDeletedRecords.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Data Freed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalDeletedSize.toFixed(1)} GB
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
        >
          <option value="all">Tất cả statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Deletion Requests */}
      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(request.status)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {request.requestId}
                </span>
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(request.status)} text-white text-[10px] font-bold rounded-full`}>
                  {request.status}
                </span>
                {request.verified && (
                  <Check className="h-3 w-3 text-green-500" />
                )}
              </div>
              {request.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => handleCancelRequest(request.id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                  title="Cancel request"
                >
                  <Ban className="h-3 w-3 text-slate-500" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">User ID</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {request.userId}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Requested</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {new Date(request.requestDate).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>

            <div className="mb-2">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Data Types</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {request.dataTypes.map((type, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-600 dark:text-slate-400">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Reason</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {request.reason}
              </div>
            </div>

            {request.status === 'pending' && !request.verified && (
              <button
                type="button"
                onClick={() => handleVerifyRequest(request.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Check className="h-3 w-3" />
                Verify Request
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Deletion Logs */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Deletion Logs
        </h4>
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {log.dataType}
                  </span>
                  {log.status === 'success' ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(log.deletedAt).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span>{log.recordCount.toLocaleString()} records</span>
                <span>•</span>
                <span>{log.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Request Form */}
      {showNewRequest && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Tạo deletion request mới
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Data Types
              </label>
              <div className="flex flex-wrap gap-2">
                {['Personal Info', 'Memories', 'Location Data', 'Session Data', 'Analytics', 'All Data'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      if (selectedDataTypes.includes(type)) {
                        setSelectedDataTypes(prev => prev.filter(t => t !== type));
                      } else {
                        setSelectedDataTypes(prev => [...prev, type]);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      selectedDataTypes.includes(type)
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Lý do yêu cầu xóa dữ liệu..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowNewRequest(false);
                  setSelectedDataTypes([]);
                  setReason('');
                }}
                className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={selectedDataTypes.length === 0 || !reason}
                className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
        <p className="text-[10px] text-red-700 dark:text-red-400">
          <strong>Lưu ý:</strong> Quyền bị xóa (GDPR Article 17) cho phép người dùng yêu cầu xóa toàn bộ dữ liệu cá nhân với verification và compliance tracking.
        </p>
      </div>
    </div>
  );
}