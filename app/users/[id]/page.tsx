"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { usersApi, type UserProfile } from "@/lib/api";
import Logo from "@/components/Logo";

const SNS_LINKS = [
  { key: "x_url", label: "X" },
  { key: "instagram_url", label: "Instagram" },
  { key: "note_url", label: "note" },
  { key: "youtube_url", label: "YouTube" },
  { key: "tiktok_url", label: "TikTok" },
] as const;

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setToken(session.access_token);
      const data = await usersApi.show(session?.access_token ?? "", id).catch(() => null);
      setProfile(data);
      setLoading(false);
    };
    init();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
        <p className="text-sm tracking-widest" style={{ color: "#9C8F7A" }}>読み込み中...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
        <p className="text-sm tracking-widest" style={{ color: "#9C8F7A" }}>ユーザーが見つかりません</p>
      </div>
    );
  }

  const snsList = SNS_LINKS.filter(({ key }) => profile[key]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: "#F5F0E8", borderColor: "#D4C9B0" }}>
        <div className="flex items-center gap-4">
          <Logo />
          <Link href="/" className="text-xs tracking-widest" style={{ color: "#9C8F7A" }}>← 一覧へ</Link>
        </div>
        {token && (
          <Link href="/my" className="text-xs tracking-widest" style={{ color: "#52B788" }}>マイページ</Link>
        )}
      </header>

      <main className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-10">

        {/* プロフィール */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#D4C9B0" }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl" style={{ color: "#9C8F7A" }}>農</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-base tracking-widest" style={{ color: "#1B4332" }}>{profile.name}</h1>
              {profile.prefecture && (
                <p className="text-xs tracking-wider" style={{ color: "#9C8F7A" }}>{profile.prefecture}</p>
              )}
              <p className="text-xs tracking-wider" style={{ color: "#B0A48E" }}>試験記録 {profile.posts_count}件</p>
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#3D2B1F" }}>{profile.bio}</p>
          )}

          {snsList.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {snsList.map(({ key, label }) => (
                <a
                  key={key}
                  href={profile[key]!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-wider px-3 py-1 border"
                  style={{ borderColor: "#C8BFA8", color: "#6B5E4E" }}
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 投稿一覧 */}
        <div className="flex flex-col gap-4 border-t pt-8" style={{ borderColor: "#D4C9B0" }}>
          <h2 className="text-xs tracking-widest" style={{ color: "#52B788" }}>試験記録</h2>
          {profile.posts && profile.posts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {profile.posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <div className="flex flex-col gap-2 px-4 py-4 border transition-opacity hover:opacity-70" style={{ borderColor: "#D4C9B0" }}>
                    <p className="text-sm leading-relaxed" style={{ color: "#1B4332" }}>{post.curiosity}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5" style={{ backgroundColor: "#D4EAD8", color: "#1B4332" }}>#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] tracking-wider" style={{ color: "#B0A48E" }}>{formatDate(post.created_at)}</span>
                      <span className="text-[10px]" style={{ color: "#9C8F7A" }}>あぐり！ {post.agris_count}</span>
                      <span className="text-[10px]" style={{ color: "#9C8F7A" }}>コメント {post.comments_count}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm tracking-widest" style={{ color: "#B0A48E" }}>まだ公開記録がありません</p>
          )}
        </div>

      </main>
    </div>
  );
}
