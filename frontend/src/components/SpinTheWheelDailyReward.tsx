'use client';

import { useState, useEffect } from 'react';
import {
  Award,
  Calendar,
  Check,
  Clock,
  Coins,
  Crown,
  Flame,
  Gift,
  Heart,
  Lock,
  Pause,
  Play,
  RefreshCw,
  RotateCw,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Unlock,
  Zap
} from 'lucide-react';

interface SpinTheWheelProps {
  onCancel?: () => void;
}

interface Prize {
  id: string;
  label: string;
  value: number;
  icon: string;
  color: string;
  probability: number;
}

export default function SpinTheWheel({ onCancel }: SpinTheWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [spinsAvailable, setSpinsAvailable] = useState(1);
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(null);
  const [streak, setStreak] = useState(5);
  const [totalSpins, setTotalSpins] = useState(127);

  const [prizes, setPrizes] = useState<Prize[]>([
    { id: '1', label: '10 Coins', value: 10, icon: 'coins', color: 'from-yellow-400 to-yellow-500', probability: 30 },
    { id: '2', label: '25 Coins', value: 25, icon: 'coins', color: 'from-yellow-500 to-orange-500', probability: 25 },
    { id: '3', label: '50 Coins', value: 50, icon: 'coins', color: 'from-orange-500 to-red-500', probability: 20 },
    { id: '4', label: '100 Coins', value: 100, icon: 'coins', color: 'from-red-500 to-pink-500', probability: 10 },
    { id: '5', label: 'Sticker Pack', value: 150, icon: 'gift', color: 'from-pink-500 to-purple-500', probability: 8 },
    { id: '6', label: '200 Coins', value: 200, icon: 'coins', color: 'from-purple-500 to-indigo-500', probability: 5 },
    { id: '7', label: 'Premium Theme', value: 300, icon: 'star', color: 'from-indigo-500 to-blue-500', probability: 1.5 },
    { id: '8', label: '500 Coins', value: 500, icon: 'crown', color: 'from-blue-500 to-cyan-500', probability: 0.5 },
  ]);

  const segmentAngle = 360 / prizes.length;

  const handleSpin = () => {
    if (isSpinning || spinsAvailable <= 0) return;

    setIsSpinning(true);
    setShowResult(false);
    setCurrentPrize(null);

    const randomAngle = Math.random() * 360;
    const spins = 5 + Math.random() * 5;
    const finalAngle = spinAngle + spins * 360 + randomAngle;

    setSpinAngle(finalAngle);

    setTimeout(() => {
      const normalizedAngle = finalAngle % 360;
      const prizeIndex = Math.floor((360 - normalizedAngle + segmentAngle / 2) / segmentAngle) % prizes.length;
      const prize = prizes[prizeIndex];
      
      setCurrentPrize(prize);
      setShowResult(true);
      setIsSpinning(false);
      setSpinsAvailable(spinsAvailable - 1);
      setLastSpinDate(new Date().toISOString().split('T')[0]);
      setTotalSpins(totalSpins + 1);
    }, 5000);
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'coins': return <Coins className="h-6 w-6" />;
      case 'gift': return <Gift className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'crown': return <Crown className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };

  const getStreakBonus = () => {
    if (streak >= 30) return 100;
    if (streak >= 14) return 50;
    if (streak >= 7) return 25;
    if (streak >= 3) return 10;
    return 0;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <RefreshCw className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Spin the Wheel
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily reward spin
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Đóng"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Spins Available</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{spinsAvailable}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Streak</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              {streak}
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Spins</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{totalSpins}</p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <div
              className="w-64 h-64 rounded-full border-4 border-slate-300 dark:border-slate-600 relative overflow-hidden"
              style={{
                transform: `rotate(${spinAngle}deg)`,
                transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              {prizes.map((prize, index) => (
                <div
                  key={prize.id}
                  className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${prize.color}`}
                  style={{
                    transform: `rotate(${index * segmentAngle}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%)`,
                  }}
                >
                  <div
                    className="absolute top-4 left-1/2 transform -translate-x-1/2"
                    style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                  >
                    <div className="flex flex-col items-center text-white">
                      {getIcon(prize.icon)}
                      <span className="text-xs font-semibold mt-1">{prize.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-slate-900 dark:border-t-white" />
            </div>
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning || spinsAvailable <= 0}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-20"
            >
              {isSpinning ? (
                <RotateCw className="h-8 w-8 animate-spin" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        {showResult && currentPrize && (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-gradient-to-br ${currentPrize.color} text-white`}>
                {getIcon(currentPrize.icon)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                  Congratulations!
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  You won: <span className="font-semibold text-yellow-600 dark:text-yellow-400">{currentPrize.label}</span>
                </p>
              </div>
              <Check className="h-6 w-6 text-green-500" />
            </div>
          </div>
        )}

        {spinsAvailable <= 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Next Spin Available
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Come back tomorrow for your free spin!
            </p>
          </div>
        )}

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Streak Bonus
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Keep spinning daily to build your streak and earn bonus coins!
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Current bonus:</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">+{getStreakBonus()} coins</span>
          </div>
          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${(streak / 30) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {streak}/30 days for maximum bonus
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">
            Prize Probabilities
          </h4>
          <div className="space-y-2">
            {prizes.map((prize) => (
              <div key={prize.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded bg-gradient-to-br ${prize.color} text-white`}>
                    {getIcon(prize.icon)}
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{prize.label}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{prize.probability}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
