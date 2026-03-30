"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { postsApi } from "@/lib/api";
import TagInput from "@/components/TagInput";
import Logo from "@/components/Logo";

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

export default function NewPostPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [curiosity, setCuriosity] = useState("");
  const [trial, setTrial] = useState("");
  const [findings, setFindings] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/auth");
        return;
      }
      setToken(session.access_token);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setLoading(true);

    try {
      const post = await postsApi.create(token, {
        curiosity,
        trial,
        findings: findings || null,
        tags,
        status,
      });
      router.push(`/posts/${post.id}`);
    } catch {
      setError("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>

      {/* ヘッダー */}
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: "#F5F0E8", borderColor: "#D4C9B0" }}>
        <Logo />
        <span className="text-xs tracking-widest" style={{ color: "#9C8F7A" }}>試験を記録する</span>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* 気になったこと */}
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
              placeholder="定植後の活着率が圃場の端と中央で差が出ている気がする"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#52B788")}
              onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
            />
          </div>

          {/* やったこと */}
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
              placeholder="端列と中央列それぞれ10株ずつ、活着率と草丈を2週間計測した"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#52B788")}
              onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
            />
          </div>

          {/* わかったこと */}
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>
              わかったこと
              <span className="ml-1 text-[10px]" style={{ color: "#B0A48E" }}>（任意・後から追記可）</span>
            </label>
            <textarea
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              rows={4}
              placeholder="端列の活着率が中央より約15%低く、風当たりの強さが原因と考えられる"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#52B788")}
              onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
            />
          </div>

          {/* ハッシュタグ */}
          <TagInput tags={tags} onChange={setTags} />

          {/* ステータス */}
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

          {/* ボタン */}
          <div className="flex gap-4 pt-2">
            <Link href="/" className="flex-1">
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
              disabled={loading}
              className="flex-1 py-3 text-sm tracking-widest transition-opacity"
              style={{ backgroundColor: "#1B4332", color: "#F5F0E8", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "送信中..." : "記録する"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
