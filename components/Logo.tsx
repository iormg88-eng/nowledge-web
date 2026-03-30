import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href}>
      <div className="relative inline-block">
        <span className="absolute -top-3 -left-4 text-[9px] tracking-widest" style={{ color: "#52B788" }}>オープン</span>
        <span className="text-2xl font-bold" style={{ color: "#1B4332" }}>農</span>
        <span className="absolute -bottom-2 -right-5 text-[9px] tracking-widest" style={{ color: "#52B788" }}>レッジ</span>
      </div>
    </Link>
  );
}
