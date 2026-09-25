'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Edit,
  Info,
  Pill,
  Plus,
  RefreshCw,
  Star
} from 'lucide-react';

interface MedicationTrackingProps {
  onCancel?: () => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice_daily' | 'three_times_daily' | 'weekly' | 'as_needed';
  timeOfDay: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  adherenceRate: number;
  lastTaken?: string;
  nextDose?: string;
}

interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  takenAt: string;
  status: 'taken' | 'skipped' | 'missed';
  notes?: string;
}

interface MedicationSettings {
  remindersEnabled: boolean;
  reminderAdvance: number;
  autoLog: boolean;
  showInactive: boolean;
}

export default function MedicationTracking({ onCancel }: MedicationTrackingProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);

  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: 'Vitamin D3', dosage: '1000 IU', frequency: 'daily', timeOfDay: ['08:00'], startDate: '2024-01-01', isActive: true, adherenceRate: 95, lastTaken: '2024-01-17 08:00', nextDose: '2024-01-18 08:00' },
    { id: '2', name: 'Omega-3', dosage: '1000mg', frequency: 'daily', timeOfDay: ['12:00'], startDate: '2024-01-01', isActive: true, adherenceRate: 90, lastTaken: '2024-01-17 12:00', nextDose: '2024-01-18 12:00' },
    { id: '3', name: 'Ibuprofen', dosage: '200mg', frequency: 'as_needed', timeOfDay: [], startDate: '2024-01-01', isActive: true, adherenceRate: 100 },
  ]);

  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([
    { id: '1', medicationId: '1', medicationName: 'Vitamin D3', takenAt: '2024-01-17 08:00', status: 'taken' },
    { id: '2', medicationId: '2', medicationName: 'Omega-3', takenAt: '2024-01-17 12:00', status: 'taken' },
    { id: '3', medicationId: '1', medicationName: 'Vitamin D3', takenAt: '2024-01-16 08:00', status: 'taken' },
  ]);

  const [medicationSettings, setMedicationSettings] = useState<MedicationSettings>({
    remindersEnabled: true,
    reminderAdvance: 15,
    autoLog: false,
    showInactive: false,
  });

  const [currentMedication, setCurrentMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'daily' as 'daily' | 'twice_daily' | 'three_times_daily' | 'weekly' | 'as_needed',
    timeOfDay: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
  });

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: currentMedication.name,
      dosage: currentMedication.dosage,
      frequency: currentMedication.frequency,
      timeOfDay: currentMedication.timeOfDay,
      startDate: currentMedication.startDate,
      isActive: true,
      adherenceRate: 100,
    };
    setMedications([...medications, newMedication]);
    setCurrentMedication({
      name: '',
      dosage: '',
      frequency: 'daily',
      timeOfDay: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  const logDose = (medicationId: string) => {
    const medication = medications.find(m => m.id === medicationId);
    if (!medication) return;

    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId,
      medicationName: medication.name,
      takenAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'taken',
    };
    setMedicationLogs([...medicationLogs, newLog]);
  };

  const toggleMedicationActive = (id: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, isActive: !med.isActive } : med
    ));
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'twice_daily': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'three_times_daily': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'weekly': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'as_needed': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl">
            <Pill className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Medication Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track medications and adherence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isTrackingEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isTrackingEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Medications</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{medications.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{medications.filter(m => m.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Adherence</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{(medications.reduce((acc, m) => acc + m.adherenceRate, 0) / medications.length).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Doses Logged</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{medicationLogs.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isTrackingEnabled}
              onChange={(e) => setIsTrackingEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Tracking</span>
          </div>
          <button
            type="button"
            onClick={addMedication}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Medication
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Add Medication</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Pill className="h-4 w-4 text-rose-400" />
                <span className="text-xs text-slate-900 dark:text-white">Medication Name</span>
              </div>
              <input
                type="text"
                value={currentMedication.name}
                onChange={(e) => setCurrentMedication({ ...currentMedication, name: e.target.value })}
                placeholder="Enter medication name..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Dosage</span>
              </div>
              <input
                type="text"
                value={currentMedication.dosage}
                onChange={(e) => setCurrentMedication({ ...currentMedication, dosage: e.target.value })}
                placeholder="e.g., 1000 IU"
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-32"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Frequency</span>
              </div>
              <select
                value={currentMedication.frequency}
                onChange={(e) => setCurrentMedication({ ...currentMedication, frequency: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="daily">Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="three_times_daily">Three Times Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Start Date</span>
              </div>
              <input
                type="date"
                value={currentMedication.startDate}
                onChange={(e) => setCurrentMedication({ ...currentMedication, startDate: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Medication Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-rose-400" />
                <span className="text-xs text-slate-900 dark:text-white">Reminders</span>
              </div>
              <input
                type="checkbox"
                checked={medicationSettings.remindersEnabled}
                onChange={(e) => setMedicationSettings({ ...medicationSettings, remindersEnabled: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Reminder Advance (min)</span>
              </div>
              <input
                type="number"
                value={medicationSettings.reminderAdvance}
                onChange={(e) => setMedicationSettings({ ...medicationSettings, reminderAdvance: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Log</span>
              </div>
              <input
                type="checkbox"
                checked={medicationSettings.autoLog}
                onChange={(e) => setMedicationSettings({ ...medicationSettings, autoLog: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Medications</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {medications.map((med) => (
              <div key={med.id} className={`p-3 rounded-lg border ${med.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Pill className="h-4 w-4 text-rose-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{med.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getFrequencyColor(med.frequency)}`}>
                          {med.frequency.replace('_', ' ')}
                        </span>
                        {!med.isActive && (
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{med.dosage} • Since {med.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{med.adherenceRate}%</span>
                    <input
                      type="checkbox"
                      checked={med.isActive}
                      onChange={() => toggleMedicationActive(med.id)}
                      className="rounded"
                    />
                  </div>
                </div>
                {med.timeOfDay.length > 0 && (
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-1">
                      {med.timeOfDay.map((time) => (
                        <span key={time} className="px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => logDose(med.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Log Dose
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Logs</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {medicationLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-slate-900 dark:text-white">{log.medicationName}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{log.takenAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Medication Tracking Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Track medications with dosage and frequency</li>
              <li>• Log doses to monitor adherence</li>
              <li>• Set reminders for scheduled medications</li>
              <li>• View adherence rates over time</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
