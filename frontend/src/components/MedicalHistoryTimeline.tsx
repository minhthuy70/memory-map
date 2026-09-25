'use client';

import { useState } from 'react';
import {
  Calendar,
  FileText,
  Filter,
  History,
  Hospital,
  Info,
  Plus,
  RefreshCw,
  Stethoscope
} from 'lucide-react';

interface MedicalHistoryTimelineProps {
  onCancel?: () => void;
}

interface MedicalEvent {
  id: string;
  date: string;
  eventType: 'checkup' | 'diagnosis' | 'treatment' | 'surgery' | 'emergency' | 'vaccination' | 'lab_test';
  provider: string;
  facility?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  attachments?: number;
}

interface TimelineFilter {
  eventType?: string;
  dateRange?: { start: string; end: string };
  provider?: string;
}

export default function MedicalHistoryTimeline({ onCancel }: MedicalHistoryTimelineProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isTimelineEnabled, setIsTimelineEnabled] = useState(true);

  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([
    { id: '1', date: '2024-01-15', eventType: 'checkup', provider: 'Dr. Smith', facility: 'City Hospital', diagnosis: 'Healthy', treatment: 'Annual physical', notes: 'Blood pressure normal, weight stable', attachments: 2 },
    { id: '2', date: '2023-12-01', eventType: 'vaccination', provider: 'Dr. Johnson', facility: 'Community Clinic', diagnosis: 'Flu vaccine', treatment: 'Influenza vaccine 2023', notes: 'No adverse reactions', attachments: 1 },
    { id: '3', date: '2023-10-20', eventType: 'lab_test', provider: 'Pathology Lab', facility: 'Medical Center', diagnosis: 'Blood work', treatment: 'Complete blood count, lipid panel', notes: 'All results within normal range', attachments: 3 },
    { id: '4', date: '2023-08-15', eventType: 'diagnosis', provider: 'Dr. Williams', facility: 'Specialist Clinic', diagnosis: 'Mild hypertension', treatment: 'Lifestyle changes, monitoring', notes: 'Diet and exercise recommended', attachments: 2 },
    { id: '5', date: '2023-06-01', eventType: 'checkup', provider: 'Dr. Smith', facility: 'City Hospital', diagnosis: 'Healthy', treatment: 'Routine checkup', notes: 'No concerns', attachments: 1 },
  ]);

  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>({});

  const [currentEvent, setCurrentEvent] = useState({
    date: new Date().toISOString().split('T')[0],
    eventType: 'checkup' as 'checkup' | 'diagnosis' | 'treatment' | 'surgery' | 'emergency' | 'vaccination' | 'lab_test',
    provider: '',
    facility: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });

  const addEvent = () => {
    const newEvent: MedicalEvent = {
      id: Date.now().toString(),
      date: currentEvent.date,
      eventType: currentEvent.eventType,
      provider: currentEvent.provider,
      facility: currentEvent.facility,
      diagnosis: currentEvent.diagnosis,
      treatment: currentEvent.treatment,
      notes: currentEvent.notes,
      attachments: 0,
    };
    setMedicalEvents([...medicalEvents, newEvent].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentEvent({
      date: new Date().toISOString().split('T')[0],
      eventType: 'checkup',
      provider: '',
      facility: '',
      diagnosis: '',
      treatment: '',
      notes: '',
    });
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'checkup': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'diagnosis': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'treatment': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'surgery': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'emergency': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'vaccination': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300';
      case 'lab_test': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'checkup': return <Stethoscope className="h-4 w-4" />;
      case 'diagnosis': return <FileText className="h-4 w-4" />;
      case 'treatment': return <Hospital className="h-4 w-4" />;
      case 'surgery': return <Hospital className="h-4 w-4" />;
      case 'emergency': return <Hospital className="h-4 w-4" />;
      case 'vaccination': return <Stethoscope className="h-4 w-4" />;
      case 'lab_test': return <FileText className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredEvents = medicalEvents.filter(event => {
    if (timelineFilter.eventType && event.eventType !== timelineFilter.eventType) return false;
    if (timelineFilter.provider && !event.provider.toLowerCase().includes(timelineFilter.provider.toLowerCase())) return false;
    if (timelineFilter.dateRange) {
      const eventDate = new Date(event.date);
      if (eventDate < new Date(timelineFilter.dateRange.start) || eventDate > new Date(timelineFilter.dateRange.end)) return false;
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Medical History Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chronological medical events and records
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isTimelineEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isTimelineEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Events</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{medicalEvents.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Providers</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{new Set(medicalEvents.map(e => e.provider)).size}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Facilities</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{new Set(medicalEvents.map(e => e.facility).filter(Boolean)).size}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Attachments</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{medicalEvents.reduce((acc, e) => acc + (e.attachments || 0), 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isTimelineEnabled}
              onChange={(e) => setIsTimelineEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Timeline</span>
          </div>
          <button
            type="button"
            onClick={addEvent}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Event
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Filter className="h-3 w-3" />
            Filter
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Add Medical Event</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-slate-900 dark:text-white">Date</span>
              </div>
              <input
                type="date"
                value={currentEvent.date}
                onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Event Type</span>
              </div>
              <select
                value={currentEvent.eventType}
                onChange={(e) => setCurrentEvent({ ...currentEvent, eventType: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="checkup">Checkup</option>
                <option value="diagnosis">Diagnosis</option>
                <option value="treatment">Treatment</option>
                <option value="surgery">Surgery</option>
                <option value="emergency">Emergency</option>
                <option value="vaccination">Vaccination</option>
                <option value="lab_test">Lab Test</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Provider</span>
              </div>
              <input
                type="text"
                value={currentEvent.provider}
                onChange={(e) => setCurrentEvent({ ...currentEvent, provider: e.target.value })}
                placeholder="Dr. Name"
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Hospital className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Facility</span>
              </div>
              <input
                type="text"
                value={currentEvent.facility}
                onChange={(e) => setCurrentEvent({ ...currentEvent, facility: e.target.value })}
                placeholder="Hospital/Clinic name"
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Diagnosis</span>
              </div>
              <input
                type="text"
                value={currentEvent.diagnosis}
                onChange={(e) => setCurrentEvent({ ...currentEvent, diagnosis: e.target.value })}
                placeholder="Diagnosis or condition"
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Treatment</span>
              </div>
              <input
                type="text"
                value={currentEvent.treatment}
                onChange={(e) => setCurrentEvent({ ...currentEvent, treatment: e.target.value })}
                placeholder="Treatment details"
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Notes</span>
              </div>
              <textarea
                value={currentEvent.notes}
                onChange={(e) => setCurrentEvent({ ...currentEvent, notes: e.target.value })}
                placeholder="Additional notes..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Medical Timeline</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getEventTypeColor(event.eventType)}`}>
                    {getEventTypeIcon(event.eventType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{event.date}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getEventTypeColor(event.eventType)}`}>
                          {event.eventType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{event.provider}</p>
                    {event.facility && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{event.facility}</p>
                    )}
                    {event.diagnosis && (
                      <p className="text-xs text-slate-900 dark:text-white mb-1">Diagnosis: {event.diagnosis}</p>
                    )}
                    {event.treatment && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Treatment: {event.treatment}</p>
                    )}
                    {event.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-1">{event.notes}</p>
                    )}
                    {event.attachments && event.attachments > 0 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{event.attachments} attachment(s)</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Medical Timeline Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Chronological view of all medical events</li>
              <li>• Event types: checkup, diagnosis, treatment, surgery, emergency, vaccination, lab test</li>
              <li>• Track providers and facilities</li>
              <li>• Attach medical documents and reports</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
