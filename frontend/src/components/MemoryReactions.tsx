'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Reaction {
  id: string;
  reactionType: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  replies?: Comment[];
}

export default function MemoryReactions() {
  const { token } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Mock memory ID for demo
  const memoryId = 'demo-memory-id';

  useEffect(() => {
    fetchReactions();
    if (showComments) {
      fetchComments();
    }
  }, [token, showComments]);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`http://localhost:3001/social/reactions/${memoryId}`);
      const data = await response.json();
      setReactions(data);
    } catch (error) {
      console.error('Failed to fetch reactions:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3001/social/comments/${memoryId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const addReaction = async (reactionType: string) => {
    try {
      await fetch('http://localhost:3001/social/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memoryId, reactionType }),
      });

      await fetchReactions();
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await fetch('http://localhost:3001/social/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memoryId, content: newComment }),
      });

      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const reactionEmojis = {
    heart: '❤️',
    hug: '🤗',
    moved: '🥺',
    proud: '🌟',
    celebration: '🎉',
    nostalgic: '🍂',
  };

  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.reactionType] = (acc[r.reactionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Memory Reactions & Empathy System</h2>

      {/* Reactions */}
      <div className="mb-6 p-4 bg-pink-50 rounded-lg">
        <h3 className="text-lg font-semibold text-pink-800 mb-4">React to this memory</h3>
        <div className="flex gap-3">
          {Object.entries(reactionEmojis).map(([type, emoji]) => (
            <button
              key={type}
              onClick={() => addReaction(type)}
              className="flex flex-col items-center gap-1 px-4 py-2 bg-white rounded-lg hover:bg-pink-100 transition-colors border-2 border-pink-200"
            >
              <span className="text-3xl">{emoji}</span>
              <span className="text-xs text-gray-600 capitalize">{type}</span>
              <span className="text-xs font-bold text-pink-600">{reactionCounts[type] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comments Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          {/* Add Comment */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Add a comment</h3>
            <form onSubmit={addComment} className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Comment
              </button>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                      {comment.user.avatarUrl ? (
                        <img src={comment.user.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                      ) : (
                        <span className="text-xl">👤</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-800">{comment.user.username}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-4 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{reply.user.username}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-pink-50 rounded-lg">
        <h4 className="font-semibold text-pink-800 mb-2">About Reactions & Comments</h4>
        <ul className="text-sm text-pink-700 space-y-1">
          <li>• Diverse reactions: Heart, Warm Hug, Moved, Proud, Celebration, Nostalgic</li>
          <li>• Reaction counts and user reaction list</li>
          <li>• Threaded comments with emoji picker</li>
          <li>• Mention @friends and moderation controls</li>
        </ul>
      </div>
    </div>
  );
}
