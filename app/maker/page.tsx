"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { postsApi, type Post } from "@/lib/api";
import Logo from "@/components/Logo";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function MakerPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [tag, setTag] = useState("");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/auth"); return; }
      setToken(session.access_token);
    };
    init();
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !tag.trim()) return;
    setSearching(true);
    const q = tag.trim().replace(/^#/, "");
    const data = await postsApi.list(token, q).catch(() => []);
    setPosts(data ?? []);
    setSearching(false);
  };

  const totalAgris = posts?.reduce((sum, p) => sum + p.agris_count, 0) ?? 0;
  const totalComments = posts?.reduce((sum, p) => sum + p.comments_count, 0) ?? 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: "#F5F0E8", borderColor: "#D4C9B0" }}>
        <Logo />
        <div className="flex items-center gap-4">
          <span className="text-xs tracking-widest" style={{ color: "#9C8F7A" }}>メーカー向けダッシュボード</span>
          <Link href="/my" className="text-xs tracking-widest" style={{ color: "#52B788" }}>マイページ</Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* タグ検索 */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="#農薬A"
            style={{
              flex: 1,
              backgroundColor: "#EDE8DC",
              border: "1px solid #C8BFA8",
              color: "#1B4332",
              padding: "10px 14px",
              fontSize: "0.875rem",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#52B788")}
            onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
          />
          <button
            type="submit"
            disabled={searching || !tag.trim()}
            style={{
              backgroundColor: "#1B4332",
              color: "#F5F0E8",
              padding: "10px 20px",
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
              opacity: searching || !tag.trim() ? 0.5 : 1,
            }}
          >
            {searching ? "検索中..." : "検索"}
          </button>
        </form>

        {/* 集計 */}
        {posts !== null && (
          <>
            <div className="flex gap-3">
              {[
                { label: "該当投稿数", value: posts.length, unit: "件" },
                { label: "総あぐり！数", value: totalAgris, unit: "件" },
                { label: "総コメント数", value: totalComments, unit: "件" },
              ].map(({ label, value, unit }) => (
                <div
                  key={label}
                  className="flex-1 flex flex-col gap-1 items-center py-4 border"
                  style={{ backgroundColor: "#FDFAF4", borderColor: "#D4C9B0" }}
                >
                  <span className="text-[10px] tracking-widest" style={{ color: "#9C8F7A" }}>{label}</span>
                  <span className="text-2xl tracking-wider" style={{ color: "#1B4332" }}>
                    {value.toLocaleString()}
                    <span className="text-xs ml-0.5" style={{ color: "#9C8F7A" }}>{unit}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* 投稿一覧 */}
            <div className="flex flex-col gap-3">
              {posts.length === 0 ? (
                <p className="text-sm tracking-widest text-center py-12" style={{ color: "#9C8F7A" }}>
                  該当する投稿がありません
                </p>
              ) : (
                posts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.id}`}>
                    <div
                      className="flex flex-col gap-2 px-5 py-4 border transition-colors cursor-pointer"
                      style={{ backgroundColor: "#FDFAF4", borderColor: "#D4C9B0" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F5EFE2")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FDFAF4")}
                    >
                      <p className="text-sm leading-relaxed" style={{ color: "#1B4332" }}>{post.curiosity}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] tracking-wider" style={{ color: "#B0A48E" }}>{formatDate(post.created_at)}</span>
                        <span className="text-[11px]" style={{ color: "#52B788" }}>あぐり！ {post.agris_count}</span>
                        <span className="text-[11px]" style={{ color: "#9C8F7A" }}>コメント {post.comments_count}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
