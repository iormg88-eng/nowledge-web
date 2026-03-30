"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ResultLog = {
  id: string;
  body: string;
  created_at: string;
};

type Comment = {
  id: string;
  body: string;
  author: { id: string; name: string };
  created_at: string;
};

type PostDetail = {
  id: string;
  curiosity: string;
  trial: string;
  findings: string | null;
  status: string;
  tags: string[];
  agris_count: number;
  comments_count: number;
  author: { id: string; supabase_uid: string; name: string };
  created_at: string;
  result_logs: ResultLog[];
  comments: Comment[];
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs tracking-widest" style={{ color: "#52B788" }}>{label}</h2>
      <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#1B4332" }}>
        {children}
      </div>
    </section>
  );
}

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [supabaseUid, setSupabaseUid] = useState<string | null>(null);
  const [agrisCount, setAgrisCount] = useState(0);
  const [agried, setAgried] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
        setSupabaseUid(session.user.id);
      }

      const headers: Record<string, string> = {};
      if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;

      const res = await fetch(`${API_URL}/api/v1/posts/${id}`, { headers });
      if (!res.ok) { router.replace("/"); return; }
      const data: PostDetail = await res.json();
      setPost(data);
      setAgrisCount(data.agris_count);
      setLoading(false);
    };
    init();
  }, [id, router]);

  const handleAgri = async () => {
    const method = agried ? "DELETE" : "POST";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/api/v1/posts/${id}/agris`, { method, headers });
    if (res.ok) {
      const data = await res.json();
      setAgrisCount(data.agris_count);
      setAgried(!agried);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !commentBody.trim()) return;
    setCommentLoading(true);
    const res = await fetch(`${API_URL}/api/v1/posts/${id}/comments`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ comment: { body: commentBody } }),
    });
    if (res.ok) {
      const newComment: Comment = await res.json();
      setPost((prev) => prev ? { ...prev, comments: [...prev.comments, newComment] } : prev);
      setCommentBody("");
    }
    setCommentLoading(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/v1/posts/${id}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setPost((prev) => prev ? { ...prev, comments: prev.comments.filter((c) => c.id !== commentId) } : prev);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
        <p className="text-sm tracking-widest" style={{ color: "#9C8F7A" }}>読み込み中...</p>
      </div>
    );
  }

  if (!post) return null;

  const isOwner = supabaseUid && post.author.supabase_uid === supabaseUid;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>

      {/* ヘッダー */}
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: "#F5F0E8", borderColor: "#D4C9B0" }}>
        <div className="flex items-center gap-4">
          <Logo />
          <Link href="/" className="text-xs tracking-widest" style={{ color: "#9C8F7A" }}>
            ← 一覧へ
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs tracking-widest" style={{ color: "#9C8F7A" }}>
            {post.author.name} · {formatDate(post.created_at)}
          </span>
          {isOwner && (
            <Link href={`/posts/${id}/edit`} className="text-xs tracking-widest" style={{ color: "#52B788" }}>
              編集
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-10">

        {/* IMR本文 */}
        <div className="flex flex-col gap-8 pb-8 border-b" style={{ borderColor: "#D4C9B0" }}>
          <Section label="気になったこと">{post.curiosity}</Section>
          <Section label="やったこと">{post.trial}</Section>
          {post.findings && <Section label="わかったこと">{post.findings}</Section>}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs tracking-wide px-2 py-0.5" style={{ backgroundColor: "#D4EAD8", color: "#1B4332" }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 結果ログ */}
        {post.result_logs.length > 0 && (
          <div className="flex flex-col gap-4 pb-8 border-b" style={{ borderColor: "#D4C9B0" }}>
            <h2 className="text-xs tracking-widest" style={{ color: "#52B788" }}>記録の経過</h2>
            <div className="flex flex-col gap-4">
              {post.result_logs.map((log) => (
                <div key={log.id} className="flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: "#52B788" }} />
                    <div className="w-px flex-1" style={{ backgroundColor: "#D4C9B0" }} />
                  </div>
                  <div className="flex flex-col gap-1 pb-4">
                    <span className="text-[10px] tracking-widest" style={{ color: "#B0A48E" }}>{formatDate(log.created_at)}</span>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#1B4332" }}>{log.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* あぐり！ */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleAgri}
            className="px-6 py-2 text-sm tracking-widest border transition-colors"
            style={{
              borderColor: agried ? "#1B4332" : "#C8BFA8",
              backgroundColor: agried ? "#1B4332" : "transparent",
              color: agried ? "#F5F0E8" : "#1B4332",
            }}
          >
            あぐり！
          </button>
          <span className="text-sm" style={{ color: "#52B788" }}>{agrisCount}</span>
        </div>

        {/* コメント */}
        <div className="flex flex-col gap-6 pt-2">
          <h2 className="text-xs tracking-widest" style={{ color: "#9C8F7A" }}>
            コメント {post.comments.length > 0 && `(${post.comments.length})`}
          </h2>

          {post.comments.length > 0 && (
            <div className="flex flex-col gap-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs tracking-wider" style={{ color: "#6B5E4E" }}>{comment.author.name}</span>
                      <span className="text-[10px]" style={{ color: "#B0A48E" }}>{formatDate(comment.created_at)}</span>
                    </div>
                    {token && comment.author.id === post.author.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-[10px] tracking-widest"
                        style={{ color: "#B0A48E" }}
                      >
                        削除
                      </button>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#1B4332" }}>{comment.body}</p>
                </div>
              ))}
            </div>
          )}

          {/* コメント入力 or ログイン誘導 */}
          {token ? (
            <form onSubmit={handleComment} className="flex flex-col gap-3">
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                rows={3}
                placeholder="考察や改善提案をどうぞ"
                className="w-full px-4 py-3 text-sm outline-none"
                style={{
                  backgroundColor: "#EDE8DC",
                  border: "1px solid #C8BFA8",
                  color: "#1B4332",
                  resize: "vertical",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#52B788")}
                onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
              />
              <button
                type="submit"
                disabled={commentLoading || !commentBody.trim()}
                className="self-end px-6 py-2 text-sm tracking-widest transition-opacity"
                style={{
                  backgroundColor: "#1B4332",
                  color: "#F5F0E8",
                  opacity: commentLoading || !commentBody.trim() ? 0.5 : 1,
                }}
              >
                {commentLoading ? "送信中..." : "コメントする"}
              </button>
            </form>
          ) : (
            <Link href="/auth">
              <p className="text-xs tracking-widest text-center py-4 border" style={{ color: "#9C8F7A", borderColor: "#D4C9B0" }}>
                コメントするには<span style={{ color: "#52B788" }}>ログイン</span>が必要です
              </p>
            </Link>
          )}
        </div>

      </main>
    </div>
  );
}
