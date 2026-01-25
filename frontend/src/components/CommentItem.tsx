import React from 'react';
import type { Comment } from "../interfaces/Comment.ts"

const CommentItem = (comment: Comment) => {
  return (
    <div className="flex gap-3 border-b border-gray-100 dark:border-slate-800 pb-4 last:border-0">
      <img
        src={comment.author.avatarUrl || `https://ui-avatars.com/api/?name=${comment.author.username}`}
        alt={comment.author.username}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border dark:border-slate-700"
      />
      <div className="flex-1">
        <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">
          <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm mb-1">
            {comment.author.username}
          </p>
          <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">
            {comment.text}
          </p>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-500 mt-2 ml-4">
          {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default CommentItem;
