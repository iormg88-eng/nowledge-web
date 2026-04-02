import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t py-8 px-6" style={{ backgroundColor: "#F5F0E8", borderColor: "#D4C9B0" }}>
      <div className="max-w-xl mx-auto flex flex-wrap justify-center gap-6">
        <Link href="/privacy" className="text-xs tracking-widest hover:opacity-70 transition-opacity" style={{ color: "#9C8F7A" }}>
          プライバシーポリシー
        </Link>
        <Link href="/tokusho" className="text-xs tracking-widest hover:opacity-70 transition-opacity" style={{ color: "#9C8F7A" }}>
          特定商取引法に基づく表記
        </Link>
        <Link href="/terms" className="text-xs tracking-widest hover:opacity-70 transition-opacity" style={{ color: "#9C8F7A" }}>
          利用規約
        </Link>
        <a
          href="https://forms.gle/aDRFnKnU4wJPHBs28"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-widest hover:opacity-70 transition-opacity"
          style={{ color: "#9C8F7A" }}
        >
          お問い合わせ
        </a>
      </div>
      <p className="text-center text-xs mt-6 tracking-widest" style={{ color: "#B0A48E" }}>
        © 2025 農レッジ
      </p>
    </footer>
  );
}
