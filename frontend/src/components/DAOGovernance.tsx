'use client';

import { useState } from 'react';
import { Vote, X, RefreshCw, Info, CheckCircle, Star, Zap, Users, ThumbsUp, ThumbsDown, Clock, CheckSquare } from 'lucide-react';

interface DAOGovernanceProps {
  onCancel?: () => void;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  yesVotes: number;
  noVotes: number;
  requiredVotes: number;
  endDate: string;
  createdAt: string;
}

interface VoteRecord {
  id: string;
  userId: string;
  userName: string;
  proposalId: string;
  vote: 'yes' | 'no';
  timestamp: string;
}

export default function DAOGovernance({ onCancel }: DAOGovernanceProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDAOEnabled, setIsDAOEnabled] = useState(true);

  const [proposals, setProposals] = useState<Proposal[]>([
    { id: '1', title: 'Add Dark Mode', description: 'Implement dark mode theme for better night viewing', author: 'John Doe', status: 'active', yesVotes: 45, noVotes: 12, requiredVotes: 50, endDate: '2024-02-01', createdAt: '2024-01-15' },
    { id: '2', title: 'Video Editor AI', description: 'Add AI-powered video editing features', author: 'Jane Smith', status: 'active', yesVotes: 32, noVotes: 8, requiredVotes: 50, endDate: '2024-02-05', createdAt: '2024-01-18' },
    { id: '3', title: 'Mobile App v2', description: 'Redesign mobile app with new UI', author: 'Mike Johnson', status: 'passed', yesVotes: 78, noVotes: 15, requiredVotes: 50, endDate: '2024-01-20', createdAt: '2024-01-10' },
    { id: '4', title: 'VR Support', description: 'Add VR/AR support for immersive memories', author: 'Sarah Wilson', status: 'rejected', yesVotes: 28, noVotes: 55, requiredVotes: 50, endDate: '2024-01-25', createdAt: '2024-01-12' },
  ]);

  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([
    { id: '1', userId: 'user1', userName: 'John Doe', proposalId: '1', vote: 'yes', timestamp: '2024-01-15 10:30' },
    { id: '2', userId: 'user2', userName: 'Jane Smith', proposalId: '1', vote: 'yes', timestamp: '2024-01-15 11:45' },
    { id: '3', userId: 'user3', userName: 'Mike Johnson', proposalId: '2', vote: 'yes', timestamp: '2024-01-18 14:20' },
    { id: '4', userId: 'user4', userName: 'Sarah Wilson', proposalId: '2', vote: 'no', timestamp: '2024-01-18 15:30' },
  ]);

  const voteOnProposal = (proposalId: string, vote: 'yes' | 'no') => {
    setProposals(proposals.map(proposal => 
      proposal.id === proposalId 
        ? { ...proposal, [vote === 'yes' ? 'yesVotes' : 'noVotes']: proposal[vote === 'yes' ? 'yesVotes' : 'noVotes'] + 1 }
        : proposal
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'passed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? ((votes / total) * 100).toFixed(1) : '0';
  };

  const totalVotes = (proposal: Proposal) => proposal.yesVotes + proposal.noVotes;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <Vote className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              DAO Governance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Community voting on new features
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isDAOEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isDAOEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Proposals</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{proposals.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{proposals.filter(p => p.status === 'active').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Passed</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{proposals.filter(p => p.status === 'passed').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Votes</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{proposals.reduce((acc, p) => acc + totalVotes(p), 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isDAOEnabled}
              onChange={(e) => setIsDAOEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable DAO</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Vote className="h-3 w-3" />
            Create Proposal
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Proposals</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Vote className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{proposal.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{proposal.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">By {proposal.author} • Created: {proposal.createdAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{totalVotes(proposal)} votes</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Required: {proposal.requiredVotes}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${getVotePercentage(proposal.yesVotes, totalVotes(proposal))}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {getVotePercentage(proposal.yesVotes, totalVotes(proposal))}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3 text-green-500" />
                      {proposal.yesVotes} Yes
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="h-3 w-3 text-red-500" />
                      {proposal.noVotes} No
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      Ends: {proposal.endDate}
                    </span>
                  </div>
                </div>
                {proposal.status === 'active' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => voteOnProposal(proposal.id, 'yes')}
                      className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      Vote Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => voteOnProposal(proposal.id, 'no')}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      Vote No
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Votes</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {voteRecords.map((record) => (
              <div key={record.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-slate-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{record.userName}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Voted <span className={record.vote === 'yes' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{record.vote.toUpperCase()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{record.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">DAO Governance Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Community members can propose new features</li>
              <li>• Voting requires token ownership</li>
              <li>• Proposals need minimum votes to pass</li>
              <li>• Passed proposals are implemented by the team</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
