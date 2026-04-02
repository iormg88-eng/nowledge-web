import Link from "next/link";
import Logo from "@/components/Logo";

const items: { label: string; value: string }[] = [
  { label: "販売業者", value: "Till Apps" },
  { label: "運営責任者", value: "Suguri Mori" },
  { label: "所在地", value: "〒018-5201　秋田県鹿角市花輪字高屋63番地1" },
  { label: "電話番号", value: "お問い合わせフォームよりご連絡ください" },
  { label: "メールアドレス", value: "お問い合わせフォームよりご連絡ください" },
  { label: "サービス名", value: "農レッジ" },
  { label: "販売価格", value: "各プランのページに表示する価格（税込）" },
  { label: "サービス提供時期", value: "決済完了後、即時ご利用いただけます" },
  { label: "支払方法", value: "クレジットカード決済（Stripe）" },
  { label: "支払時期", value: "お申し込み時に即時決済" },
  { label: "返品・キャンセルについて", value: "デジタルコンテンツの性質上、決済完了後の返金はお受けできません。ただし、サービスの不具合等に起因する場合はこの限りではありません。" },
  { label: "動作環境", value: "最新版の主要ブラウザ（Chrome・Safari・Firefox・Edge）推奨" },
];

export default function TokushoPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: "#F5F0E8", borderColor: "#D4C9B0" }}>
        <Logo />
        <Link href="/" className="text-xs tracking-widest" style={{ color: "#52B788" }}>
          トップへ戻る
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-lg tracking-widest mb-8" style={{ color: "#1B4332" }}>特定商取引法に基づく表記</h1>

        <div className="flex flex-col gap-0 border-t" style={{ borderColor: "#D4C9B0" }}>
          {items.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row border-b py-4 gap-2"
              style={{ borderColor: "#D4C9B0" }}
            >
              <dt className="text-xs tracking-widest w-full sm:w-40 shrink-0" style={{ color: "#1B4332" }}>
                {label}
              </dt>
              <dd className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
                {value}
              </dd>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs tracking-widest leading-loose" style={{ color: "#B0A48E" }}>
          ※ ご不明な点は
          <a
            href="https://forms.gle/aDRFnKnU4wJPHBs28"
            target="_blank"
            rel="noopener noreferrer"
            className="underline mx-1"
            style={{ color: "#52B788" }}
          >
            お問い合わせフォーム
          </a>
          よりお問い合わせください。
        </p>
      </main>
    </div>
  );
}
