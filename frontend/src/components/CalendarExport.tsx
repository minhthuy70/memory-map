'use client';

import React from 'react';
import { Calendar, Download } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  content?: string;
  memoryDate: string;
  latitude: number;
  longitude: number;
  locationName?: string;
}

interface CalendarExportProps {
  memories: Memory[];
}

export default function CalendarExport({ memories }: CalendarExportProps) {
  const generateICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Memory Map//Calendar Export//VN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    memories.forEach((memory) => {
      const startDate = new Date(memory.memoryDate);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1); // 1 hour duration

      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${memory.id}@memorymap`);
      icsContent.push(`DTSTAMP:${formatDate(new Date())}`);
      icsContent.push(`DTSTART:${formatDate(startDate)}`);
      icsContent.push(`DTEND:${formatDate(endDate)}`);
      icsContent.push(`SUMMARY:${escapeICS(memory.title)}`);
      icsContent.push(`DESCRIPTION:${escapeICS(memory.content || '')}`);
      icsContent.push(`LOCATION:${escapeICS(memory.locationName || `${memory.latitude}, ${memory.longitude}`)}`);
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');
    return icsContent.join('\r\n');
  };

  const escapeICS = (text: string) => {
    return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  };

  const downloadICS = () => {
    const icsData = generateICS();
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memories-${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadICS}
      disabled={memories.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Xuất lịch"
      title="Xuất lịch"
    >
      <Calendar className="h-4 w-4" />
      <Download className="h-4 w-4" />
      <span>Xuất lịch</span>
    </button>
  );
}
