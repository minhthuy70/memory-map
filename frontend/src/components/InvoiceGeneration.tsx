'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Download,
  Eye,
  FileText,
  Filter,
  Info,
  RefreshCw,
  Star,
  Trash2,
  Zap
} from 'lucide-react';

interface InvoiceGenerationProps {
  onCancel?: () => void;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  userName: string;
  plan: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  pdfUrl: string;
}

export default function InvoiceGeneration({ onCancel }: InvoiceGenerationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: '1', invoiceNumber: 'INV-2024-001', userId: 'user1', userName: 'John Doe', plan: 'Pro Plan', amount: 19.99, currency: 'USD', status: 'paid', issueDate: '2024-01-01', dueDate: '2024-01-15', paidDate: '2024-01-14', pdfUrl: '/invoices/inv-001.pdf' },
    { id: '2', invoiceNumber: 'INV-2024-002', userId: 'user2', userName: 'Jane Smith', plan: 'Basic Plan', amount: 9.99, currency: 'USD', status: 'paid', issueDate: '2024-01-15', dueDate: '2024-01-30', paidDate: '2024-01-28', pdfUrl: '/invoices/inv-002.pdf' },
    { id: '3', invoiceNumber: 'INV-2024-003', userId: 'user3', userName: 'Mike Johnson', plan: 'Family Plan', amount: 24.99, currency: 'USD', status: 'pending', issueDate: '2024-02-01', dueDate: '2024-02-15', pdfUrl: '/invoices/inv-003.pdf' },
    { id: '4', invoiceNumber: 'INV-2024-004', userId: 'user4', userName: 'Sarah Wilson', plan: 'Enterprise Plan', amount: 99.99, currency: 'USD', status: 'overdue', issueDate: '2024-01-20', dueDate: '2024-02-05', pdfUrl: '/invoices/inv-004.pdf' },
    { id: '5', invoiceNumber: 'INV-2024-005', userId: 'user5', userName: 'Tom Brown', plan: 'Pro Plan', amount: 19.99, currency: 'USD', status: 'cancelled', issueDate: '2024-01-25', dueDate: '2024-02-10', pdfUrl: '/invoices/inv-005.pdf' },
  ]);

  const generateInvoice = () => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      userId: 'user6',
      userName: 'New User',
      plan: 'Pro Plan',
      amount: 19.99,
      currency: 'USD',
      status: 'pending',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pdfUrl: '/invoices/inv-new.pdf',
    };
    setInvoices([...invoices, newInvoice]);
  };

  const markAsPaid = (id: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id 
        ? { ...invoice, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0] }
        : invoice
    ));
  };

  const cancelInvoice = (id: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status: 'cancelled' as const } : invoice
    ));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'cancelled': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const filteredInvoices = statusFilter === 'all' 
    ? invoices 
    : invoices.filter(invoice => invoice.status === statusFilter);

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Invoice Generation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automatic PDF invoice generation
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{invoices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Paid</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{invoices.filter(i => i.status === 'paid').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{invoices.filter(i => i.status === 'pending').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Amount</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${invoices.reduce((acc, i) => acc + i.amount, 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="button"
            onClick={generateInvoice}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <FileText className="h-3 w-3" />
            Generate Invoice
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Invoices ({filteredInvoices.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{invoice.invoiceNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{invoice.userName} • {invoice.plan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(invoice.amount, invoice.currency)}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{invoice.currency}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Issue: {invoice.issueDate}</span>
                    <span>•</span>
                    <span>Due: {invoice.dueDate}</span>
                    {invoice.paidDate && (
                      <>
                        <span>•</span>
                        <span>Paid: {invoice.paidDate}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download PDF
                  </button>
                  {invoice.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => markAsPaid(invoice.id)}
                      className="px-2 py-1 rounded text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Mark as Paid
                    </button>
                  )}
                  {invoice.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => cancelInvoice(invoice.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteInvoice(invoice.id)}
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Invoice Generation Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• PDF invoices are generated automatically</li>
              <li>• Invoices are sent via email to users</li>
              <li>• Status tracking: paid, pending, overdue, cancelled</li>
              <li>• Download and view invoices anytime</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
