"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { usersApi } from "@/lib/api";
import Logo from "@/components/Logo";

type Aggregation = {
  total_posts: number;
  published_posts: number;
  total_agris: number;
  total_comments: number;
  recent_posts_7d: number;
  aggregated_at: string;
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const STATS = [
  { key: "total_posts", label: "総投稿数", unit: "件" },
  { key: "published_posts", label: "公開投稿数", unit: "件" },
  { key: "total_agris", label: "総あぐり！数", unit: "件" },
  { key: "total_comments", label: "総コメント数", unit: "件" },
  { key: "recent_posts_7d", label: "直近7日間の投稿数", unit: "件" },
] as const;

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<Aggregation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/auth"); return; }

      const profile = await usersApi.me(session.access_token).catch(() => null);
      if (!profile || profile.role !== "admin") { router.replace("/"); return; }

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const res = await fetch(`${url}/rest/v1/aggregations?id=eq.1&select=*`, {
        headers: {
          apikey: key!,
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) { setError("データの取得に失敗しました。"); setLoading(false); return; }
      const json = await res.json();
      setData(json[0] ?? null);
      setLoading(false);
    };
    init();
  }, [router]);

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
        <div className="flex items-center gap-4">
          <span className="text-xs tracking-widest" style={{ color: "#9C8F7A" }}>管理ダッシュボード</span>
          <Link href="/my" className="text-xs tracking-widest" style={{ color: "#52B788" }}>マイページ</Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        {error ? (
          <p className="text-sm text-center" style={{ color: "#9B4444" }}>{error}</p>
        ) : !data ? (
          <p className="text-sm text-center tracking-widest" style={{ color: "#9C8F7A" }}>集計データがありません</p>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {STATS.map(({ key, label, unit }) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-5 py-4 border"
                  style={{ backgroundColor: "#FDFAF4", borderColor: "#D4C9B0" }}
                >
                  <span className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>{label}</span>
                  <span className="text-xl tracking-wider" style={{ color: "#1B4332" }}>
                    {data[key].toLocaleString()}
                    <span className="text-xs ml-1" style={{ color: "#9C8F7A" }}>{unit}</span>
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-right tracking-wider" style={{ color: "#B0A48E" }}>
              最終集計：{formatDateTime(data.aggregated_at)}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
