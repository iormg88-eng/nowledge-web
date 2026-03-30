"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { usersApi, type UserProfile } from "@/lib/api";
import Logo from "@/components/Logo";

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

const inputStyle = {
  backgroundColor: "#EDE8DC",
  border: "1px solid #C8BFA8",
  color: "#1B4332",
  width: "100%",
  padding: "10px 14px",
  fontSize: "0.875rem",
  outline: "none",
};

const SNS_FIELDS = [
  { key: "x_url", label: "X (Twitter)", placeholder: "https://x.com/username" },
  { key: "instagram_url", label: "Instagram", placeholder: "https://instagram.com/username" },
  { key: "note_url", label: "note", placeholder: "https://note.com/username" },
  { key: "youtube_url", label: "YouTube", placeholder: "https://youtube.com/@channel" },
  { key: "tiktok_url", label: "TikTok", placeholder: "https://tiktok.com/@username" },
] as const;

export default function ProfileEditPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [sns, setSns] = useState({ x_url: "", instagram_url: "", note_url: "", youtube_url: "", tiktok_url: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/auth"); return; }
      setToken(session.access_token);

      const profile: UserProfile = await usersApi.me(session.access_token);
      setUserId(profile.id);
      setName(profile.name ?? "");
      setBio(profile.bio ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
      setPrefecture(profile.prefecture ?? "");
      setSns({
        x_url: profile.x_url ?? "",
        instagram_url: profile.instagram_url ?? "",
        note_url: profile.note_url ?? "",
        youtube_url: profile.youtube_url ?? "",
        tiktok_url: profile.tiktok_url ?? "",
      });
      setLoading(false);
    };
    init();
  }, [router]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) { setError("画像のアップロードに失敗しました。"); setUploading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setSaving(true);
    try {
      await usersApi.updateMe(token, { name, bio, avatar_url: avatarUrl, prefecture, ...sns });
      router.push("/my");
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
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
        <span className="text-xs tracking-widest" style={{ color: "#9C8F7A" }}>プロフィール編集</span>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* アバター */}
          <div className="flex flex-col gap-2 items-center">
            <div
              className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "#D4C9B0" }}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl" style={{ color: "#9C8F7A" }}>農</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs tracking-widest"
              style={{ color: "#52B788" }}
            >
              {uploading ? "アップロード中..." : "画像を変更"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* ユーザー名 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>
              ユーザー名
              <span className="ml-2" style={{ color: "#52B788" }}>●</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#52B788")}
              onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
            />
          </div>

          {/* プロフィール */}
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>
              プロフィール
              <span className="ml-1 text-[10px]" style={{ color: "#B0A48E" }}>（任意・160文字以内）</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" as const }}
              onFocus={(e) => (e.target.style.borderColor = "#52B788")}
              onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
            />
            <p className="text-[10px] text-right" style={{ color: "#B0A48E" }}>{bio.length} / 160</p>
          </div>

          {/* 都道府県 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>
              都道府県
              <span className="ml-1 text-[10px]" style={{ color: "#B0A48E" }}>（任意）</span>
            </label>
            <select
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
              style={{ ...inputStyle, appearance: "auto" }}
              onFocus={(e) => (e.target.style.borderColor = "#52B788")}
              onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* SNS */}
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>SNSリンク<span className="ml-1 text-[10px]" style={{ color: "#B0A48E" }}>（任意）</span></p>
            {SNS_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-[11px] tracking-wider" style={{ color: "#9C8F7A" }}>{label}</label>
                <input
                  type="url"
                  value={sns[key]}
                  onChange={(e) => setSns((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#52B788")}
                  onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
                />
              </div>
            ))}
          </div>

          {error && <p className="text-xs text-center" style={{ color: "#9B4444" }}>{error}</p>}

          <div className="flex gap-4 pt-2">
            <Link href="/my" className="flex-1">
              <button type="button" className="w-full py-3 text-sm tracking-widest border" style={{ borderColor: "#C8BFA8", color: "#9C8F7A", backgroundColor: "transparent" }}>
                キャンセル
              </button>
            </Link>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 py-3 text-sm tracking-widest"
              style={{ backgroundColor: "#1B4332", color: "#F5F0E8", opacity: saving || uploading ? 0.6 : 1 }}
            >
              {saving ? "保存中..." : "保存する"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
