"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { postsApi, type Post } from "@/lib/api";
import Logo from "@/components/Logo";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
        setLoggedIn(true);
      }
      const data = await postsApi.list(session?.access_token ?? "").catch(() => []);
      setPosts(data ?? []);
      setLoading(false);
    };
    init();
  }, []);

  const handleSearch = async (q: string) => {
    const data = await postsApi.list(token ?? "", q).catch(() => []);
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
        {loggedIn ? (
          <Link href="/my" className="text-xs tracking-widest" style={{ color: "#52B788" }}>
            マイページ
          </Link>
        ) : (
          <Link href="/auth" className="text-xs tracking-widest" style={{ color: "#52B788" }}>
            ログイン
          </Link>
        )}
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder="キーワードで検索" />
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-sm tracking-widest" style={{ color: "#9C8F7A" }}>まだ投稿がありません</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </main>

      {loggedIn && (
        <Link href="/posts/new">
          <button
            className="fixed bottom-8 right-8 w-14 h-14 text-2xl flex items-center justify-center shadow-md transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#1B4332", color: "#F5F0E8" }}
            aria-label="新規投稿"
          >
            ＋
          </button>
        </Link>
      )}
    </div>
  );
}
