import Link from "next/link";
import Logo from "@/components/Logo";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: "#F5F0E8", borderColor: "#D4C9B0" }}>
        <Logo />
        <Link href="/" className="text-xs tracking-widest" style={{ color: "#52B788" }}>
          トップへ戻る
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-lg tracking-widest mb-8" style={{ color: "#1B4332" }}>プライバシーポリシー</h1>

        <div className="flex flex-col gap-8 text-sm leading-relaxed" style={{ color: "#52463A" }}>
          <section>
            <p className="text-xs tracking-widest mb-4" style={{ color: "#9C8F7A" }}>
              農レッジ（以下「本サービス」）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第1条　収集する情報</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本サービスは、以下の情報を収集することがあります。
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {[
                "メールアドレス（アカウント登録時）",
                "ユーザーが投稿するコンテンツ（テキスト・画像等）",
                "アクセスログ（IPアドレス、ブラウザ情報、閲覧ページ等）",
                "Cookie等の技術的情報",
              ].map((item) => (
                <li key={item} className="text-xs tracking-widest flex items-start gap-2" style={{ color: "#9C8F7A" }}>
                  <span style={{ color: "#52B788" }}>・</span>{item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第2条　利用目的</h2>
            <ul className="flex flex-col gap-1">
              {[
                "本サービスの提供・運営・改善",
                "ユーザーへのお知らせ・サポートの提供",
                "不正利用の防止および安全確保",
                "利用状況の分析・統計処理",
              ].map((item) => (
                <li key={item} className="text-xs tracking-widest flex items-start gap-2" style={{ color: "#9C8F7A" }}>
                  <span style={{ color: "#52B788" }}>・</span>{item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第3条　第三者への提供</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本サービスは、以下のいずれかに該当する場合を除き、ユーザーの個人情報を第三者に提供しません。
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {[
                "ユーザーの同意がある場合",
                "法令に基づく開示要請があった場合",
                "人の生命・身体・財産の保護に必要な場合",
              ].map((item) => (
                <li key={item} className="text-xs tracking-widest flex items-start gap-2" style={{ color: "#9C8F7A" }}>
                  <span style={{ color: "#52B788" }}>・</span>{item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第4条　外部サービスの利用</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本サービスは、認証・データ管理にSupabaseを利用しています。これらのサービスのプライバシーポリシーについては、各サービスの規約をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第5条　安全管理措置</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本サービスは、収集した個人情報の漏洩・滅失・毀損を防止するため、適切な安全管理措置を講じます。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第6条　個人情報の開示・訂正・削除</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              ユーザーは、本サービスが保有する自身の個人情報について、開示・訂正・削除を請求できます。お問い合わせフォームよりご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第7条　プライバシーポリシーの変更</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              本ポリシーは、必要に応じて改定することがあります。重要な変更がある場合は、本サービス上でお知らせします。改定後も引き続きご利用いただいた場合、変更後のポリシーに同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-sm tracking-widest mb-3" style={{ color: "#1B4332" }}>第8条　お問い合わせ</h2>
            <p className="text-xs tracking-widest leading-loose" style={{ color: "#9C8F7A" }}>
              個人情報の取扱いに関するご質問・ご要望は、
              <a
                href="https://forms.gle/aDRFnKnU4wJPHBs28"
                target="_blank"
                rel="noopener noreferrer"
                className="underline ml-1"
                style={{ color: "#52B788" }}
              >
                お問い合わせフォーム
              </a>
              よりご連絡ください。
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
