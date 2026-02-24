"use client";

import { useState } from "react";

interface FlaggedPost {
  id: string;
  content: string;
  isFlagged: boolean;
  isHidden: boolean;
  flagReason: string | null;
  createdAt: string;
  user: { name: string | null; email: string | null };
  _count: { comments: number };
}

interface FlaggedComment {
  id: string;
  content: string;
  isHidden: boolean;
  createdAt: string;
  user: { name: string | null; email: string | null };
  post: { id: string; content: string };
}

export default function ModerationQueue({
  posts,
  comments,
}: {
  posts: FlaggedPost[];
  comments: FlaggedComment[];
}) {
  const [tab, setTab] = useState<"posts" | "comments">("posts");
  const [acting, setActing] = useState<string | null>(null);

  const handlePostAction = async (postId: string, action: "approve" | "hide" | "delete") => {
    setActing(postId);
    try {
      await fetch(`/api/moderation/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      window.location.reload();
    } catch {
      alert("Action failed");
    } finally {
      setActing(null);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface-card border border-border rounded-xl p-1 w-fit">
        {(["posts", "comments"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? "bg-brand text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t === "posts" ? `Posts (${posts.length})` : `Comments (${comments.length})`}
          </button>
        ))}
      </div>

      {tab === "posts" && (
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="bg-surface-card border border-border rounded-2xl p-8 text-center text-text-tertiary">
              No flagged posts — all clear! ✓
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-surface-card border border-border rounded-2xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-sm font-medium text-text-primary">
                      {post.user.name || post.user.email}
                    </span>
                    <span className="text-xs text-text-tertiary ml-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2 mt-1">
                      {post.isFlagged && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-status-warningDim text-status-warning">
                          🚩 Flagged{post.flagReason ? `: ${post.flagReason}` : ""}
                        </span>
                      )}
                      {post.isHidden && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-status-errorDim text-status-error">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text-secondary bg-surface-bg rounded-xl p-3 mb-3">
                  {post.content.length > 300 ? post.content.slice(0, 300) + "..." : post.content}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePostAction(post.id, "approve")}
                    disabled={acting === post.id}
                    className="text-xs px-3 py-1.5 bg-status-successDim text-status-success rounded-lg hover:bg-status-success/20 disabled:opacity-50"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handlePostAction(post.id, "hide")}
                    disabled={acting === post.id}
                    className="text-xs px-3 py-1.5 bg-status-warningDim text-status-warning rounded-lg hover:bg-status-warning/20 disabled:opacity-50"
                  >
                    Hide
                  </button>
                  <button
                    onClick={() => handlePostAction(post.id, "delete")}
                    disabled={acting === post.id}
                    className="text-xs px-3 py-1.5 bg-status-errorDim text-status-error rounded-lg hover:bg-status-error/20 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "comments" && (
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="bg-surface-card border border-border rounded-2xl p-8 text-center text-text-tertiary">
              No hidden comments — all clear! ✓
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="bg-surface-card border border-border rounded-2xl p-4"
              >
                <div className="text-sm text-text-primary mb-2">
                  <span className="font-medium">{c.user.name || c.user.email}</span>
                  <span className="text-text-tertiary ml-2 text-xs">
                    on post: {c.post.content.slice(0, 50)}...
                  </span>
                </div>
                <p className="text-sm text-text-secondary bg-surface-bg rounded-xl p-3">
                  {c.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
