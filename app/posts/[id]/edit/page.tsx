"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { postsApi } from "@/lib/api";
import Logo from "@/components/Logo";
import TagInput from "@/components/TagInput";

const inputStyle = {
  backgroundColor: "#EDE8DC",
  border: "1px solid #C8BFA8",
  color: "#1B4332",
  width: "100%",
  padding: "12px 16px",
  fontSize: "0.875rem",
  lineHeight: "1.75",
  outline: "none",
  resize: "vertical" as const,
};

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [curiosity, setCuriosity] = useState("");
  const [trial, setTrial] = useState("");
  const [findings, setFindings] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/auth"); return; }
      setToken(session.access_token);

      const post = await postsApi.show(session.access_token, id).catch(() => null);
      if (!post) { router.replace("/"); return; }

      setCuriosity(post.curiosity);
      setTrial(post.trial);
      setFindings(post.findings ?? "");
      setTags(post.tags ?? []);
      setStatus(post.status);
      setLoading(false);
    };
    init();
  }, [id, router]);

  const handleDelete = async () => {
    if (!token) return;
    if (!confirm("この記録を削除しますか？この操作は取り消せません。")) return;
    setDeleting(true);
    try {
      await postsApi.destroy(token, id);
      router.replace("/my");
    } catch {
      setError("削除に失敗しました。もう一度お試しください。");
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setSaving(true);

    try {
      await postsApi.update(token, id, {
        curiosity,
        trial,
        findings: findings || null,
        tags,
        status,
      });
      router.push(`/posts/${id}`);
    } catch {
      setError("更新に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
        <p className="text-sm tracking-widest" style={{ color: "#9C8F7A" }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: "#F5F0E8", borderColor: "#D4C9B0" }}>
        <Logo />
        <span className="text-xs tracking-widest" style={{ color: "#9C8F7A" }}>記録を編集する</span>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>
              気になったこと
              <span className="ml-2" style={{ color: "#52B788" }}>●</span>
            </label>
            <textarea
              value={curiosity}
              onChange={(e) => setCuriosity(e.target.value)}
              required
              rows={4}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#52B788")}
              onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>
              やったこと
              <span className="ml-2" style={{ color: "#52B788" }}>●</span>
            </label>
            <textarea
              value={trial}
              onChange={(e) => setTrial(e.target.value)}
              required
              rows={4}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#52B788")}
              onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>
              わかったこと
              <span className="ml-1 text-[10px]" style={{ color: "#B0A48E" }}>（任意）</span>
            </label>
            <textarea
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              rows={4}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#52B788")}
              onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
            />
          </div>

          {/* ハッシュタグ */}
          <TagInput tags={tags} onChange={setTags} />

          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>公開設定</label>
            <div className="flex gap-6">
              {[
                { value: "draft", label: "下書き" },
                { value: "published", label: "公開" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm tracking-wider" style={{ color: "#1B4332" }}>
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value as "draft" | "published")}
                    className="accent-[#1B4332]"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: "#9B4444" }}>{error}</p>
          )}

          <div className="flex gap-4 pt-2">
            <Link href={`/posts/${id}`} className="flex-1">
              <button
                type="button"
                className="w-full py-3 text-sm tracking-widest border transition-opacity"
                style={{ borderColor: "#C8BFA8", color: "#9C8F7A", backgroundColor: "transparent" }}
              >
                キャンセル
              </button>
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 text-sm tracking-widest transition-opacity"
              style={{ backgroundColor: "#1B4332", color: "#F5F0E8", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "保存中..." : "保存する"}
            </button>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs tracking-widest transition-opacity"
              style={{ color: "#B0A48E", opacity: deleting ? 0.5 : 1 }}
            >
              {deleting ? "削除中..." : "この記録を削除する"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
