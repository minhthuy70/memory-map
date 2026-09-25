'use client';

import { useState } from 'react';
import { Brain, X, Settings, CheckCircle, AlertTriangle, TrendingUp, Calendar, Clock, Activity, BarChart3, Filter, Zap, Sparkles, Target } from 'lucide-react';

interface PredictionResult {
  id: string;
  date: Date;
  predictedCount: number;
  confidence: number;
  factors: string[];
  moodPrediction: string;
  locationPrediction: string;
}

interface PredictionModel {
  id: string;
  name: string;
  accuracy: number;
  lastTrained: Date;
  features: string[];
}

interface MemoryPredictionProps {
  onCancel?: () => void;
  onGeneratePrediction?: () => Promise<void>;
}

const DEFAULT_PREDICTIONS: PredictionResult[] = [
  {
    id: 'pred-1',
    date: new Date('2024-01-15'),
    predictedCount: 18,
    confidence: 0.85,
    factors: ['Weekend', 'Holiday season', 'Historical pattern'],
    moodPrediction: 'excited',
    locationPrediction: 'Home',
  },
  {
    id: 'pred-2',
    date: new Date('2024-02-14'),
    predictedCount: 25,
    confidence: 0.92,
    factors: ['Valentine\'s Day', 'Romantic events', 'Seasonal trend'],
    moodPrediction: 'happy',
    locationPrediction: 'Restaurant',
  },
  {
    id: 'pred-3',
    date: new Date('2024-03-30'),
    predictedCount: 22,
    confidence: 0.78,
    factors: ['Weekend', 'Spring season', 'Travel pattern'],
    moodPrediction: 'excited',
    locationPrediction: 'Nature spot',
  },
];

const DEFAULT_MODELS: PredictionModel[] = [
  {
    id: 'model-1',
    name: 'Time Series LSTM',
    accuracy: 0.92,
    lastTrained: new Date('2024-01-01'),
    features: ['Time', 'Day of week', 'Month', 'Holiday'],
  },
  {
    id: 'model-2',
    name: 'Random Forest',
    accuracy: 0.88,
    lastTrained: new Date('2024-01-01'),
    features: ['Location', 'Mood', 'Weather', 'Events'],
  },
];

export default function MemoryPrediction({ onCancel, onGeneratePrediction }: MemoryPredictionProps) {
  const [predictions, setPredictions] = useState<PredictionResult[]>(DEFAULT_PREDICTIONS);
  const [models, setModels] = useState<PredictionModel[]>(DEFAULT_MODELS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModel, setSelectedModel] = useState('model-1');
  const [predictionHorizon, setPredictionHorizon] = useState(30);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
  const totalPredicted = predictions.reduce((sum, p) => sum + p.predictedCount, 0);
  const bestModel = models.reduce((max, m) => m.accuracy > max.accuracy ? m : max, models[0]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Dự đoán kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI-powered predictions
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt prediction
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Prediction model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({(m.accuracy * 100).toFixed(0)}% accuracy)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Prediction horizon: {predictionHorizon} days
              </label>
              <input
                type="range"
                min="7"
                max="90"
                value={predictionHorizon}
                onChange={(e) => setPredictionHorizon(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Confidence threshold: {(confidenceThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Predictions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {predictions.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Predicted</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalPredicted}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Best Model</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(bestModel.accuracy * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Prediction Results */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Prediction Results
        </h4>
        <div className="space-y-2">
          {predictions.map((prediction) => (
            <div
              key={prediction.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {prediction.date.toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-purple-500" />
                  <span className={`text-xs font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                    {getConfidenceLevel(prediction.confidence)} ({(prediction.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Predicted</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {prediction.predictedCount} memories
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Mood</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {prediction.moodPrediction}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Location</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {prediction.locationPrediction}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Factors</div>
                <div className="flex flex-wrap gap-1">
                  {prediction.factors.map((factor) => (
                    <span
                      key={factor}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] rounded-full"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-indigo-500"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {(prediction.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Information */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Prediction Models
        </h4>
        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.id}
              className={`p-4 rounded-lg border-2 ${
                model.id === selectedModel
                  ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {model.name}
                  </span>
                </div>
                {model.id === selectedModel && (
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Accuracy</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {(model.accuracy * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Trained</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {model.lastTrained.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Features</div>
                <div className="flex flex-wrap gap-1">
                  {model.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Dự đoán kỷ niệm sử dụng AI để dự đoán khi nào bạn có thể tạo kỷ niệm mới với confidence scores, model selection, factor analysis, và mood/location predictions.
        </p>
      </div>
    </div>
  );
}