'use client';

import { useState, useRef, useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MessageSquare, Edit2, Trash2, Pin, MapPin } from 'lucide-react';

interface MapAnnotation {
  id: string;
  position: [number, number];
  text: string;
  color: string;
  createdAt: Date;
}

interface MapAnnotationsProps {
  annotations: MapAnnotation[];
  onAddAnnotation?: (annotation: Omit<MapAnnotation, 'id' | 'createdAt'>) => void;
  onDeleteAnnotation?: (id: string) => void;
  onUpdateAnnotation?: (id: string, text: string) => void;
  enabled?: boolean;
}

export default function MapAnnotations({
  annotations,
  onAddAnnotation,
  onDeleteAnnotation,
  onUpdateAnnotation,
  enabled = false,
}: MapAnnotationsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<[number, number] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const map = useMap();

  useEffect(() => {
    if (!enabled) {
      setIsAdding(false);
      setPendingPosition(null);
      map.getContainer().style.cursor = '';
    }
  }, [enabled, map]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!enabled || !isAdding) return;
    
    const { lat, lng } = e.latlng;
    setPendingPosition([lat, lng]);
    setIsAdding(false);
    map.getContainer().style.cursor = '';
  };

  useEffect(() => {
    if (enabled && isAdding) {
      map.on('click', handleMapClick);
      map.getContainer().style.cursor = 'crosshair';
      
      return () => {
        map.off('click', handleMapClick);
        map.getContainer().style.cursor = '';
      };
    }
  }, [enabled, isAdding, map]);

  const handleAddAnnotation = (text: string) => {
    if (pendingPosition && onAddAnnotation) {
      onAddAnnotation({
        position: pendingPosition,
        text,
        color: '#3B82F6',
      });
      setPendingPosition(null);
      setEditText('');
    }
  };

  const handleDelete = (id: string) => {
    if (onDeleteAnnotation) {
      onDeleteAnnotation(id);
    }
  };

  const handleEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleSaveEdit = () => {
    if (editingId && onUpdateAnnotation) {
      onUpdateAnnotation(editingId, editText);
      setEditingId(null);
      setEditText('');
    }
  };

  const createAnnotationIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-annotation-marker',
      html: `
        <div class="annotation-pin" style="background-color: ${color};">
          <div class="annotation-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -38],
    });
  };

  if (!enabled) return null;

  return (
    <>
      {/* Annotation Toolbar */}
      <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2">
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
            isAdding
              ? 'bg-primary text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
          title={isAdding ? 'Hủy thêm ghi chú' : 'Thêm ghi chú trên bản đồ'}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs font-medium">{isAdding ? 'Đang thêm...' : 'Ghi chú'}</span>
        </button>
      </div>

      {/* Pending annotation input */}
      {pendingPosition && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 w-80">
          <div className="flex items-center gap-2 mb-3">
            <Pin className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Thêm ghi chú</h4>
          </div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Nhập ghi chú cho vị trí này..."
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => handleAddAnnotation(editText)}
              disabled={!editText.trim()}
              className="flex-1 px-3 py-2 bg-primary hover:bg-primary-hover disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Thêm ghi chú
            </button>
            <button
              type="button"
              onClick={() => {
                setPendingPosition(null);
                setEditText('');
              }}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Render annotations */}
      {annotations.map((annotation) => (
        <Marker
          key={annotation.id}
          position={annotation.position}
          icon={createAnnotationIcon(annotation.color)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              {editingId === annotation.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={!editText.trim()}
                      className="flex-1 px-2 py-1.5 bg-primary hover:bg-primary-hover disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditText('');
                      }}
                      className="px-2 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">
                      {annotation.text}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400">
                      {new Date(annotation.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(annotation.id, annotation.text)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="h-3 w-3 text-slate-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(annotation.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Annotation markers CSS */}
      <style>{`
        .custom-annotation-marker {
          background: transparent !important;
          border: none !important;
        }
        .annotation-pin {
          width: 32px;
          height: 42px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
          border: 2px solid #ffffff;
        }
        .annotation-icon {
          transform: rotate(45deg);
        }
      `}</style>
    </>
  );
}