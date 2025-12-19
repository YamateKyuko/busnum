import { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import Image from "next/image";
import Link from "next/link";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: "busnum",
  description: "Bus Navigation app",
};

export default async function Layout(props: LayoutProps<'/'>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body>
        <header className={styles.header}>
          <Link
            href="/busnum"
          >
            <Image
              src={process.env.NEXT_PUBLIC_APP_NAME == 'busnum25' ? "/busnum25.svg" : "/busnum4logo.svg"}
              alt="BusNum Logo"
              width={500}
              height={100}
            />
          </Link>
          
        </header>
        <main className={styles.main}>
          {props.children}
        </main>
        {process.env.NEXT_PUBLIC_APP_NAME == 'busnum25' &&
          <details open className={styles.notice25}>
            <summary>消す</summary>
            このアプリケーションはバスナムのアーカイブです。
            2026年1月ごろの状態を保持しています。
            最新のアプリケーションは<Link href="https://busnum.vercel.app">こちら</Link>からご覧ください。
          </details>
        }
        
        <footer className={styles.footer}>
          <p>(c) BUSNUM by Yamakyu</p>
          <details>
            <summary>ご利用の際にあたっては、こちらをご一読ください。</summary>
            本アプリケーションが利用する公共交通データは、
            公共交通事業者により提供されたデータを元にして、
            公共交通オープンデータセンターにおいて提供されるものを活用しています。
            センターにより提供されたデータ、
            あるいはアプリケーション開発者による実装の誤りによって、
            表示される情報に誤り、抜け、漏れ等がある可能性があります。
            あらかじめご了承ください。
            本アプリケーションの利用により生じた如何なる損害についても、
            開発者は、法律、あるいはセンターの規則により定められた点を除いては、
            一切の責任を負いかねますので、ご了承ください。
            本アプリケーションで表示された内容について、
            公共交通事業者、並びにセンターへの問合せは絶対に行わないでください。
            本アプリケーションに関するお問い合わせは、
            githubのissues、もしくはzennの指定記事のコメント欄におよせください。
            ご利用の際にあたっては、以上について完全に同意いただいたものとみなします。
          </details>
          <p>
            <Link href="https://github.com/YamateKyuko/busnum">github</Link>
            <Link href="https://github.com/YamateKyuko/busnum/issues">github issues</Link>
            <Link href="https://zenn.dev/yamakyu/articles/9fa8056628e92d">zenn コメント</Link>
            <Link href="https://www.odpt.org/">公共交通オープンデータセンター</Link>
          </p>
        </footer>
        <SpeedInsights />
      </body>
    </html>
  );
};