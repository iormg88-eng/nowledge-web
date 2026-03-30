import Link from "next/link";
import { type Post } from "@/lib/api";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.id}`}>
      <article
        className="p-6 transition-colors cursor-pointer border"
        style={{ backgroundColor: "#FDFAF4", borderColor: "#D4C9B0" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F5EFE2")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FDFAF4")}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <p className="text-base leading-relaxed flex-1" style={{ color: "#1B4332" }}>
            {post.curiosity}
          </p>
          {post.status === "draft" && (
            <span className="text-[10px] tracking-widest px-2 py-0.5 border shrink-0" style={{ color: "#9C8F7A", borderColor: "#C8BFA8" }}>
              下書き
            </span>
          )}
        </div>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[11px] tracking-wide px-1.5 py-0.5" style={{ backgroundColor: "#D4EAD8", color: "#1B4332" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs tracking-wider" style={{ color: "#9C8F7A" }}>{post.author.name}</span>
            <span className="text-xs" style={{ color: "#B0A48E" }}>{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: "#52B788" }}>あぐり！ {post.agris_count}</span>
            <span className="text-xs" style={{ color: "#9C8F7A" }}>コメント {post.comments_count}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
