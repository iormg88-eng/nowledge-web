import Link from "next/link";
import Logo from "@/components/Logo";

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: "#F5F0E8", borderColor: "#D4C9B0" }}>
        <Logo />
        <Link href="/" className="text-xs tracking-widest" style={{ color: "#52B788" }}>
          トップへ戻る
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-lg tracking-widest mb-8" style={{ color: "#1B4332" }}>利用規約</h1>

        <div className="flex flex-col gap-8 text-sm leading-relaxed" style={{ color: "#52463A" }}>
          <section>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本利用規約（以下「本規約」）は、農レッジ（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆様には、本規約に同意のうえ、本サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第1条　適用</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本規約は、本サービスの利用に関わる一切の関係に適用されます。本サービスを利用した時点で、本規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第2条　アカウント登録</h2>
            <ul className="flex flex-col gap-1">
              {[
                "ユーザーは正確な情報を登録するものとします",
                "アカウントは本人のみが使用できます",
                "パスワードの管理はユーザー自身の責任で行うものとします",
                "アカウントの不正利用が判明した場合は速やかにご連絡ください",
              ].map((item) => (
                <li key={item} className="text-xs tracking-widest flex items-start gap-2" style={{ color: "#9C8F7A" }}>
                  <span style={{ color: "#52B788" }}>・</span>{item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第3条　禁止事項</h2>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#9C8F7A" }}>
              ユーザーは以下の行為を行ってはなりません。
            </p>
            <ul className="flex flex-col gap-1">
              {[
                "法令または公序良俗に違反する行為",
                "他のユーザーまたは第三者への誹謗中傷・差別的表現",
                "虚偽の情報の投稿",
                "著作権・商標権等の知的財産権を侵害する行為",
                "本サービスの運営を妨害する行為",
                "営業活動・宣伝・スパム行為",
                "不正アクセス・クラッキング等",
                "その他、当サービスが不適切と判断する行為",
              ].map((item) => (
                <li key={item} className="text-xs tracking-widest flex items-start gap-2" style={{ color: "#9C8F7A" }}>
                  <span style={{ color: "#52B788" }}>・</span>{item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第4条　コンテンツの取扱い</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              ユーザーが投稿したコンテンツの著作権はユーザー本人に帰属します。ただし、本サービスの運営・改善・プロモーション等の目的において、投稿コンテンツを無償で利用できるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第5条　免責事項</h2>
            <ul className="flex flex-col gap-1">
              {[
                "本サービスは、コンテンツの正確性・有用性を保証しません",
                "ユーザー間のトラブルについて、本サービスは一切の責任を負いません",
                "システム障害・メンテナンス等による一時的なサービス停止について、責任を負いません",
                "本サービスの利用によって生じた損害について、当サービスの故意または重過失がある場合を除き責任を負いません",
              ].map((item) => (
                <li key={item} className="text-xs tracking-widest flex items-start gap-2" style={{ color: "#9C8F7A" }}>
                  <span style={{ color: "#52B788" }}>・</span>{item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第6条　サービスの変更・停止</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本サービスは、事前の通知なく、サービスの内容変更・一時停止・終了を行う場合があります。重要な変更については、可能な範囲で事前にお知らせします。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第7条　アカウントの停止・削除</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本規約に違反した場合、または不適切な利用と判断した場合、当サービスは事前の通知なくアカウントを停止・削除することができます。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第8条　規約の変更</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本規約は必要に応じて変更することがあります。変更後も継続してご利用いただいた場合、変更後の規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第9条　準拠法・管轄裁判所</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本規約の解釈には日本法を準拠法とし、本サービスに関連する紛争については、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <p className="text-xs tracking-widest" style={{ color: "#B0A48E" }}>
            制定日：2025年1月1日
          </p>
        </div>
      </main>
    </div>
  );
}
