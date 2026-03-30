"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Tab = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (tab === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("確認メールを送信しました。メールをご確認ください。");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("エラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: "#F5F0E8" }}>

      {/* ロゴ */}
      <div className="mb-12 text-center">
        <div className="relative inline-block">
          <span className="absolute -top-4 -left-6 text-xs tracking-widest" style={{ color: "#52B788" }}>
            オープン
          </span>
          <span className="text-6xl font-bold" style={{ color: "#1B4332" }}>
            農
          </span>
          <span className="absolute -bottom-3 -right-8 text-xs tracking-widest" style={{ color: "#52B788" }}>
            レッジ
          </span>
        </div>
      </div>

      {/* カード */}
      <div className="w-full max-w-sm">

        {/* タブ */}
        <div className="flex mb-8 border-b" style={{ borderColor: "#D4C9B0" }}>
          <button
            onClick={() => { setTab("login"); setError(null); setMessage(null); }}
            className="flex-1 pb-3 text-sm tracking-widest transition-colors"
            style={{
              color: tab === "login" ? "#1B4332" : "#9C8F7A",
              borderBottom: tab === "login" ? "2px solid #1B4332" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            ログイン
          </button>
          <button
            onClick={() => { setTab("signup"); setError(null); setMessage(null); }}
            className="flex-1 pb-3 text-sm tracking-widest transition-colors"
            style={{
              color: tab === "signup" ? "#1B4332" : "#9C8F7A",
              borderBottom: tab === "signup" ? "2px solid #1B4332" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            新規登録
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm outline-none transition-colors"
              style={{
                backgroundColor: "#EDE8DC",
                border: "1px solid #C8BFA8",
                color: "#1B4332",
              }}
              onFocus={(e) => e.target.style.borderColor = "#52B788"}
              onBlur={(e) => e.target.style.borderColor = "#C8BFA8"}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 text-sm outline-none transition-colors"
              style={{
                backgroundColor: "#EDE8DC",
                border: "1px solid #C8BFA8",
                color: "#1B4332",
              }}
              onFocus={(e) => e.target.style.borderColor = "#52B788"}
              onBlur={(e) => e.target.style.borderColor = "#C8BFA8"}
            />
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: "#9B4444" }}>
              {error}
            </p>
          )}

          {message && (
            <p className="text-xs text-center" style={{ color: "#52B788" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm tracking-widest transition-opacity mt-2"
            style={{
              backgroundColor: "#1B4332",
              color: "#F5F0E8",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "処理中..." : tab === "login" ? "ログイン" : "登録する"}
          </button>
        </form>
      </div>

      {/* フッター */}
      <p className="mt-16 text-xs tracking-widest" style={{ color: "#B0A48E" }}>
        農業試験の記録・共有
      </p>
    </div>
  );
}
