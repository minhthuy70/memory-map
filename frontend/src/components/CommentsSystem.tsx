'use client';

import { useState } from 'react';
import { MessageSquare, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Users, Plus, Heart, Trash2, Edit2, Reply, MoreHorizontal, ThumbsUp, Ban, Shield } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdAt: Date;
  updatedAt: Date | null;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  parentId: string | null;
  isEdited: boolean;
  isDeleted: boolean;
}

interface ModerationRule {
  id: string;
  name: string;
  type: 'auto_moderate' | 'keyword_filter' | 'spam_detection';
  enabled: boolean;
  description: string;
}

interface CommentsSystemProps {
  onCancel?: () => void;
  onPostComment?: (content: string, parentId: string | null) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  onEditComment?: (commentId: string, content: string) => Promise<void>;
  onLikeComment?: (commentId: string) => Promise<void>;
}

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    content: 'This is such a wonderful memory! 😊',
    author: 'Dad',
    authorAvatar: '/dad.jpg',
    createdAt: new Date('2024-01-12'),
    updatedAt: null,
    likes: 5,
    isLiked: true,
    replies: [
      {
        id: 'reply-1',
        content: 'I remember this day like it was yesterday!',
        author: 'Mom',
        authorAvatar: '/mom.jpg',
        createdAt: new Date('2024-01-12'),
        updatedAt: null,
        likes: 3,
        isLiked: false,
        replies: [],
        parentId: 'comment-1',
        isEdited: false,
        isDeleted: false,
      },
    ],
    parentId: null,
    isEdited: false,
    isDeleted: false,
  },
  {
    id: 'comment-2',
    content: 'Great photo quality!',
    author: 'Tom',
    authorAvatar: '/tom.jpg',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    likes: 2,
    isLiked: false,
    replies: [],
    parentId: null,
    isEdited: true,
    isDeleted: false,
  },
];

const DEFAULT_RULES: ModerationRule[] = [
  {
    id: 'rule-1',
    name: 'Auto-moderate',
    type: 'auto_moderate',
    enabled: true,
    description: 'Automatically moderate comments',
  },
  {
    id: 'rule-2',
    name: 'Keyword filter',
    type: 'keyword_filter',
    enabled: true,
    description: 'Filter inappropriate keywords',
  },
  {
    id: 'rule-3',
    name: 'Spam detection',
    type: 'spam_detection',
    enabled: true,
    description: 'Detect and block spam comments',
  },
];

export default function CommentsSystem({ onCancel, onPostComment, onDeleteComment, onEditComment, onLikeComment }: CommentsSystemProps) {
  const [comments, setComments] = useState<Comment[]>(DEFAULT_COMMENTS);
  const [rules, setRules] = useState<ModerationRule[]>(DEFAULT_RULES);
  const [showSettings, setShowSettings] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);

  const totalComments = comments.length;
  const totalReplies = comments.reduce((sum, c) => sum + c.replies.length, 0);
  const totalLikes = comments.reduce((sum, c) => sum + c.likes + c.replies.reduce((r, s) => r + s.likes, 0), 0);

  const handlePostComment = async () => {
    if (newComment.trim()) {
      await onPostComment?.(newComment, null);
      setNewComment('');
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (replyContent.trim()) {
      await onPostComment?.(replyContent, parentId);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    await onDeleteComment?.(commentId);
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, isDeleted: true } : c
    ));
  };

  const handleEdit = async (commentId: string) => {
    if (editContent.trim()) {
      await onEditComment?.(commentId, editContent);
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, updatedAt: new Date(), isEdited: true } : c
      ));
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleLike = async (commentId: string) => {
    await onLikeComment?.(commentId);
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked } : c
    ));
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hệ thống bình luận
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalComments} comments, {totalReplies} replies
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
            Cài đặt comments system
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Comment notifications
              </span>
              <button
                type="button"
                onClick={() => setEnableNotifications(!enableNotifications)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableNotifications ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enableNotifications ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-reply to mentions
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Allow anonymous comments
              </span>
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">Disabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Comments</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalComments}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Reply className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Replies</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalReplies}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Likes</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalLikes}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Moderation</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {rules.filter(r => r.enabled).length}
          </div>
        </div>
      </div>

      {/* New Comment */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Add Comment
        </h4>
        <div className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
            rows={3}
          />
          <button
            type="button"
            onClick={handlePostComment}
            disabled={!newComment.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Post Comment
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Comments
        </h4>
        <div className="space-y-2">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg border-2 ${
                comment.isDeleted
                  ? 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              {comment.isDeleted ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  This comment has been deleted
                </p>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                        <Users className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {comment.author}
                        </span>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {comment.createdAt.toLocaleDateString('vi-VN')}
                          {comment.isEdited && ' • Edited'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLike(comment.id)}
                        className={`p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded ${
                          comment.isLiked ? 'text-red-500' : 'text-slate-500'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${comment.isLiked ? 'fill-red-500' : ''}`} />
                      </button>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {comment.likes}
                      </span>
                    </div>
                  </div>

                  {editingId === comment.id ? (
                    <div className="mb-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(comment.id)}
                          className="flex-1 px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingId(null); setEditContent(''); }}
                          className="flex-1 px-2 py-1 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      {comment.content}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Reply className="h-3 w-3" />
                      Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                                <Users className="h-3 w-3 text-slate-500" />
                              </div>
                              <div>
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  {reply.author}
                                </span>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {reply.createdAt.toLocaleDateString('vi-VN')}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleLike(reply.id)}
                                className={`p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded ${
                                  reply.isLiked ? 'text-red-500' : 'text-slate-500'
                                }`}
                              >
                                <Heart className={`h-3 w-3 ${reply.isLiked ? 'fill-red-500' : ''}`} />
                              </button>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                {reply.likes}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-300">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="ml-4 mt-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handlePostReply(comment.id)}
                          className="flex-1 px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                          className="flex-1 px-2 py-1 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Moderation Rules */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Moderation Rules
        </h4>
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {rule.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {rule.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleRule(rule.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    rule.enabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      rule.enabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Hệ thống bình luận cho phép người dùng bình luận trên kỷ niệm và trả lời bình luận với likes, replies, edit/delete, moderation rules, và notification settings.
        </p>
      </div>
    </div>
  );
}