"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { postsApi, type Post } from "@/lib/api";
import Logo from "@/components/Logo";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";

export default function MyPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/auth"); return; }
      setToken(session.access_token);
      const data = await postsApi.mine(session.access_token).catch(() => []);
      setPosts(data ?? []);
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSearch = async (q: string) => {
    if (!token) return;
    const data = await postsApi.mine(token, q).catch(() => []);
    setPosts(data ?? []);
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
        <Link href="/" className="text-xs tracking-widest" style={{ color: "#9C8F7A" }}>
          みんなの試験記録
        </Link>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-2">
          <p className="text-xs tracking-widest mb-4" style={{ color: "#9C8F7A" }}>マイページ</p>
          <SearchBar onSearch={handleSearch} placeholder="自分の記録を検索" />
        </div>

        <div className="mt-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <p className="text-sm tracking-widest" style={{ color: "#9C8F7A" }}>まだ投稿がありません</p>
              <p className="text-xs tracking-widest" style={{ color: "#B0A48E" }}>最初の試験記録を書いてみましょう</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          )}
        </div>
      </main>

      <Link href="/posts/new">
        <button
          className="fixed bottom-8 right-8 w-14 h-14 text-2xl flex items-center justify-center shadow-md transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#1B4332", color: "#F5F0E8" }}
          aria-label="新規投稿"
        >
          ＋
        </button>
      </Link>
    </div>
  );
}
