'use client';

import { useState } from 'react';
import { FileText, X, Plus, Trash2, Calendar, BarChart3, Download, RefreshCw, Filter, Eye, EyeOff, Info, Grid, Layers, CheckCircle, AlertTriangle, Settings, PieChart, LineChart, BarChart, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

interface CustomReportBuilderProps {
  onCancel?: () => void;
}

interface Metric {
  id: string;
  name: string;
  selected: boolean;
}

interface FilterConfig {
  type: string;
  value: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  metrics: string[];
  filters: FilterConfig[];
  chartType: string;
}

export default function CustomReportBuilder({ onCancel }: CustomReportBuilderProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [reportName, setReportName] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'table'>('bar');
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [savedReports, setSavedReports] = useState<ReportTemplate[]>([
    { id: '1', name: 'Weekly User Growth', metrics: ['users', 'newUsers', 'activeUsers'], filters: [{ type: 'timeRange', value: 'week' }], chartType: 'line' },
    { id: '2', name: 'Revenue Overview', metrics: ['totalRevenue', 'subscriptions', 'marketplace'], filters: [{ type: 'timeRange', value: 'month' }], chartType: 'bar' },
  ]);

  const availableMetrics: Metric[] = [
    { id: 'users', name: 'Total Users', selected: false },
    { id: 'newUsers', name: 'New Users', selected: false },
    { id: 'activeUsers', name: 'Active Users', selected: false },
    { id: 'totalRevenue', name: 'Total Revenue', selected: false },
    { id: 'subscriptions', name: 'Subscriptions', selected: false },
    { id: 'marketplace', name: 'Marketplace', selected: false },
    { id: 'churnRate', name: 'Churn Rate', selected: false },
    { id: 'featureUsage', name: 'Feature Usage', selected: false },
    { id: 'conversionRate', name: 'Conversion Rate', selected: false },
    { id: 'retentionRate', name: 'Retention Rate', selected: false },
  ];

  const addFilter = () => {
    setFilters([...filters, { type: 'timeRange', value: 'month' }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: keyof FilterConfig, value: string) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  const saveReport = () => {
    if (reportName && selectedMetrics.length > 0) {
      const newReport: ReportTemplate = {
        id: Date.now().toString(),
        name: reportName,
        metrics: selectedMetrics,
        filters,
        chartType,
      };
      setSavedReports([...savedReports, newReport]);
      setReportName('');
      setSelectedMetrics([]);
      setFilters([]);
    }
  };

  const deleteReport = (reportId: string) => {
    setSavedReports(savedReports.filter(r => r.id !== reportId));
  };

  const loadReport = (report: ReportTemplate) => {
    setReportName(report.name);
    setSelectedMetrics(report.metrics);
    setFilters(report.filters);
    setChartType(report.chartType as any);
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return <BarChart className="h-4 w-4" />;
      case 'line': return <LineChart className="h-4 w-4" />;
      case 'pie': return <PieChart className="h-4 w-4" />;
      case 'table': return <Grid className="h-4 w-4" />;
      default: return <BarChart className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Custom Report Builder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create custom analytics reports
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
            {showDetails ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Saved Reports</h4>
          <div className="space-y-2">
            {savedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  {getChartIcon(report.chartType)}
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{report.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({report.metrics.length} metrics)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadReport(report)}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteReport(report.id)}
                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Create New Report</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Report Name</label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name..."
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Select Metrics</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableMetrics.map((metric) => (
                  <button
                    key={metric.id}
                    type="button"
                    onClick={() => toggleMetric(metric.id)}
                    className={`p-2 rounded-lg text-xs text-left border transition-colors ${
                      selectedMetrics.includes(metric.id)
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {metric.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Chart Type</label>
              <div className="flex gap-2">
                {(['bar', 'line', 'pie', 'table'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setChartType(type)}
                    className={`p-2 rounded-lg text-xs border transition-colors flex items-center gap-1 ${
                      chartType === type
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {getChartIcon(type)}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Filters</label>
              <div className="space-y-2">
                {filters.map((filter, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      value={filter.type}
                      onChange={(e) => updateFilter(index, 'type', e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                    >
                      <option value="timeRange">Time Range</option>
                      <option value="region">Region</option>
                      <option value="category">Category</option>
                    </select>
                    <select
                      value={filter.value}
                      onChange={(e) => updateFilter(index, 'value', e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                    >
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="quarter">Quarter</option>
                      <option value="year">Year</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeFilter(index)}
                      className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFilter}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Filter
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={saveReport}
              disabled={!reportName || selectedMetrics.length === 0}
              className="w-full px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors"
            >
              Save Report
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Report Builder Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Select multiple metrics for comprehensive reports</li>
              <li>• Use filters to narrow down data scope</li>
              <li>• Choose chart type based on data nature</li>
              <li>• Save reports for quick access later</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
