'use client';

import { useState, useRef, useEffect } from 'react';
import { useMap, Polyline, Circle, Polygon, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import { PenTool, Circle as CircleIcon, Square, Trash2, Save, X, Layers } from 'lucide-react';

type DrawingTool = 'none' | 'polyline' | 'circle' | 'rectangle' | 'polygon';

interface DrawingShape {
  id: string;
  type: DrawingTool;
  coordinates: [number, number][];
  center?: [number, number];
  radius?: number;
  color: string;
  name?: string;
  createdAt: Date;
}

interface MapDrawingToolsProps {
  shapes: DrawingShape[];
  onAddShape?: (shape: Omit<DrawingShape, 'id' | 'createdAt'>) => void;
  onDeleteShape?: (id: string) => void;
  enabled?: boolean;
}

export default function MapDrawingTools({
  shapes,
  onAddShape,
  onDeleteShape,
  enabled = false,
}: MapDrawingToolsProps) {
  const [activeTool, setActiveTool] = useState<DrawingTool>('none');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([]);
  const [currentCenter, setCurrentCenter] = useState<[number, number] | null>(null);
  const [currentRadius, setCurrentRadius] = useState<number>(0);
  const [shapeName, setShapeName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const map = useMap();
  const drawingRef = useRef<L.Polyline | L.Circle | L.Rectangle | L.Polygon | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveTool('none');
      setIsDrawing(false);
      setCurrentPoints([]);
      setCurrentCenter(null);
      setCurrentRadius(0);
      map.getContainer().style.cursor = '';
      map.dragging.enable();
      map.off('click');
      map.off('mousemove');
    }
  }, [enabled, map]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!enabled || activeTool === 'none') return;

    const { lat, lng } = e.latlng;

    switch (activeTool) {
      case 'polyline':
      case 'polygon':
        setCurrentPoints([...currentPoints, [lat, lng]]);
        break;
      case 'circle':
        if (!currentCenter) {
          setCurrentCenter([lat, lng]);
        } else {
          const radius = map.distance([lat, lng], currentCenter);
          setCurrentRadius(radius);
          setShowSaveDialog(true);
        }
        break;
      case 'rectangle':
        if (currentPoints.length === 0) {
          setCurrentPoints([[lat, lng]]);
        } else {
          const start = currentPoints[0];
          const end = [lat, lng];
          const rectanglePoints: [number, number][] = [
            start,
            [end[0], start[1]],
            end,
            [start[0], end[1]],
            start,
          ];
          setCurrentPoints(rectanglePoints);
          setShowSaveDialog(true);
        }
        break;
    }
  };

  const handleMouseMove = (e: L.LeafletMouseEvent) => {
    if (!enabled || !isDrawing || activeTool === 'none') return;

    const { lat, lng } = e.latlng;

    if (activeTool === 'circle' && currentCenter) {
      const radius = map.distance([lat, lng], currentCenter);
      setCurrentRadius(radius);
    }
  };

  useEffect(() => {
    if (enabled && activeTool !== 'none') {
      map.on('click', handleMapClick);
      map.on('mousemove', handleMouseMove);
      map.getContainer().style.cursor = 'crosshair';
      map.dragging.disable();
      setIsDrawing(true);

      return () => {
        map.off('click', handleMapClick);
        map.off('mousemove', handleMouseMove);
        map.getContainer().style.cursor = '';
        map.dragging.enable();
      };
    }
  }, [enabled, activeTool, currentPoints, currentCenter, map]);

  const handleFinishDrawing = () => {
    if (currentPoints.length < 2 && activeTool !== 'circle') return;

    const newShape: Omit<DrawingShape, 'id' | 'createdAt'> = {
      type: activeTool,
      coordinates: currentPoints,
      center: currentCenter || undefined,
      radius: currentRadius || undefined,
      color: '#6366F1',
      name: shapeName || `${activeTool} ${new Date().toLocaleTimeString('vi-VN')}`,
    };

    onAddShape?.(newShape);
    resetDrawing();
  };

  const resetDrawing = () => {
    setActiveTool('none');
    setIsDrawing(false);
    setCurrentPoints([]);
    setCurrentCenter(null);
    setCurrentRadius(0);
    setShapeName('');
    setShowSaveDialog(false);
    map.getContainer().style.cursor = '';
    map.dragging.enable();
  };

  const handleDeleteShape = (id: string) => {
    if (onDeleteShape) {
      onDeleteShape(id);
    }
  };

  const renderShape = (shape: DrawingShape) => {
    const commonProps = {
      pathOptions: {
        color: shape.color,
        weight: 3,
        opacity: 0.8,
        fillColor: shape.color,
        fillOpacity: 0.2,
      },
    };

    switch (shape.type) {
      case 'polyline':
        return <Polyline positions={shape.coordinates} {...commonProps} />;
      case 'polygon':
        return <Polygon positions={shape.coordinates} {...commonProps} />;
      case 'circle':
        return shape.center && shape.radius ? (
          <Circle center={shape.center} radius={shape.radius} {...commonProps} />
        ) : null;
      case 'rectangle':
        return shape.coordinates.length >= 4 ? (
          <Rectangle bounds={L.latLngBounds(shape.coordinates)} {...commonProps} />
        ) : null;
      default:
        return null;
    }
  };

  if (!enabled) return null;

  return (
    <>
      {/* Drawing Tools Toolbar */}
      <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTool('none');
              resetDrawing();
            }}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'none'
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Không chọn công cụ"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTool('polyline');
              resetDrawing();
            }}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'polyline'
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Vẽ đường (Polyline)"
          >
            <PenTool className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTool('circle');
              resetDrawing();
            }}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'circle'
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Vẽ hình tròn (Circle)"
          >
            <CircleIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTool('rectangle');
              resetDrawing();
            }}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'rectangle'
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Vẽ hình chữ nhật (Rectangle)"
          >
            <Square className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTool('polygon');
              resetDrawing();
            }}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'polygon'
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Vẽ đa giác (Polygon)"
          >
            <Layers className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Current drawing preview */}
      {isDrawing && currentPoints.length > 0 && (
        <>
          {activeTool === 'polyline' && <Polyline positions={currentPoints} pathOptions={{ color: '#6366F1', weight: 3, dashArray: '5, 5' }} />}
          {activeTool === 'polygon' && currentPoints.length >= 3 && (
            <Polygon positions={currentPoints} pathOptions={{ color: '#6366F1', weight: 3, fillOpacity: 0.1, dashArray: '5, 5' }} />
          )}
          {activeTool === 'rectangle' && currentPoints.length === 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
              Click để hoàn thành hình chữ nhật
            </div>
          )}
          {activeTool === 'circle' && currentCenter && currentRadius > 0 && (
            <Circle center={currentCenter} radius={currentRadius} pathOptions={{ color: '#6366F1', weight: 3, fillOpacity: 0.1, dashArray: '5, 5' }} />
          )}
        </>
      )}

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 w-80">
          <div className="flex items-center gap-2 mb-3">
            <Save className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Lưu hình vẽ</h4>
          </div>
          <input
            type="text"
            value={shapeName}
            onChange={(e) => setShapeName(e.target.value)}
            placeholder="Tên hình vẽ..."
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none mb-3"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFinishDrawing}
              className="flex-1 px-3 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={resetDrawing}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Shapes list */}
      {shapes.length > 0 && (
        <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 w-64 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Hình vẽ ({shapes.length})</h4>
            <button
              type="button"
              onClick={() => {
                shapes.forEach(shape => handleDeleteShape(shape.id));
              }}
              className="p-1 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
              title="Xóa tất cả"
            >
              <Trash2 className="h-3 w-3 text-red-500" />
            </button>
          </div>
          <div className="space-y-1">
            {shapes.map((shape) => (
              <div
                key={shape.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: shape.color }}
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1">
                    {shape.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteShape(shape.id)}
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render saved shapes */}
      {shapes.map((shape) => (
        <div key={shape.id}>{renderShape(shape)}</div>
      ))}
    </>
  );
}