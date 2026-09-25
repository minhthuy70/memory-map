'use client';

import { useState } from 'react';
import {
  AtSign,
  Award,
  Calendar,
  Check,
  Clock,
  Coins,
  Copy,
  Crown,
  Download,
  Gift,
  Link,
  Mail,
  MessageCircle,
  QrCode,
  RefreshCw,
  Share2,
  Star,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

interface ReferralRewardsProps {
  onCancel?: () => void;
}

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'completed' | 'rewarded';
  joinedAt?: string;
  rewardEarned: number;
}

export default function ReferralRewards({ onCancel }: ReferralRewardsProps) {
  const [referralCode, setReferralCode] = useState('MEMORY2024');
  const [referralLink, setReferralLink] = useState('https://memorymap.app/ref/MEMORY2024');
  const [copied, setCopied] = useState(false);
  const [selectedReward, setSelectedReward] = useState('coins');
  const [totalReferrals, setTotalReferrals] = useState(12);
  const [totalEarnings, setTotalEarnings] = useState(6000);
  const [pendingReferrals, setPendingReferrals] = useState(3);

  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'rewarded',
      joinedAt: '2026-08-15',
      rewardEarned: 500,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'rewarded',
      joinedAt: '2026-08-20',
      rewardEarned: 500,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      status: 'completed',
      joinedAt: '2026-09-01',
      rewardEarned: 0,
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      status: 'pending',
      rewardEarned: 0,
    },
    {
      id: '5',
      name: 'Tom Brown',
      email: 'tom@example.com',
      status: 'pending',
      rewardEarned: 0,
    },
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=Check out Memory Map - the best way to preserve your memories! ${referralLink}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${referralLink}`,
      email: `mailto:?subject=Check out Memory Map&body=I found this amazing app for preserving memories. Check it out: ${referralLink}`,
    };
    
    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rewarded': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getRewardTier = () => {
    if (totalReferrals >= 50) return { tier: 'Platinum', multiplier: 2, icon: Crown };
    if (totalReferrals >= 25) return { tier: 'Gold', multiplier: 1.5, icon: Star };
    if (totalReferrals >= 10) return { tier: 'Silver', multiplier: 1.25, icon: Award };
    return { tier: 'Bronze', multiplier: 1, icon: Award };
  };

  const currentTier = getRewardTier();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Referral Rewards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Earn rewards by inviting friends
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Referrals</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{totalReferrals}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Earnings</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <Coins className="h-4 w-4 text-yellow-500" />
              {totalEarnings}
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{pendingReferrals}</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <currentTier.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Current Tier: {currentTier.tier}
              </h4>
            </div>
            <span className="text-xs text-purple-600 dark:text-purple-400">
              {currentTier.multiplier}x multiplier
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${Math.min((totalReferrals / 50) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {totalReferrals}/50 referrals to reach Platinum tier
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Your Referral Link
          </h4>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs"
            >
              <MessageCircle className="h-4 w-4" />
              MessageCircle
            </button>
            <button
              type="button"
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs"
            >
              <Globe2 className="h-4 w-4" />
              Globe2
            </button>
            <button
              type="button"
              onClick={() => handleShare('email')}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors text-xs"
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors text-xs"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Referral History
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                title="Download QR Code"
              >
                <QrCode className="h-4 w-4 text-slate-500" />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                    <Users className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">
                      {referral.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {referral.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(referral.status)}`}>
                    {referral.status}
                  </span>
                  {referral.joinedAt && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {referral.joinedAt}
                    </p>
                  )}
                  {referral.rewardEarned > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      +{referral.rewardEarned} coins
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Reward Structure
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Base reward: 500 coins per successful referral</li>
            <li>• Bronze tier (0-9 referrals): 1x multiplier</li>
            <li>• Silver tier (10-24 referrals): 1.25x multiplier</li>
            <li>• Gold tier (25-49 referrals): 1.5x multiplier</li>
            <li>• Platinum tier (50+ referrals): 2x multiplier</li>
            <li>• Bonus: 100 coins for every 5 referrals</li>
          </ul>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Pro Tips
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Share your link on social media for maximum reach</li>
            <li>• Send personalized invitations to close friends</li>
            <li>• Create memories together to earn bonus rewards</li>
            <li>• Track pending referrals and follow up gently</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
