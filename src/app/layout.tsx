import { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import Image from "next/image";
import Link from "next/link";

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
        <footer className={styles.footer}>
          <p>(c) BUSNUM by Yamakyu</p>
          <p>
            本アプリケーションが利用する公共交通データは、<br />
            公共交通オープンデータセンター(ODPT)において提供されるものです。<br />
            公共交通事業者により提供されたデータを元にしていますが、<br />
            必ずしも正確・完全なものとは限りません。<br />
            本アプリケーションの表示内容について、<br />
            公共交通事業者、並びに、ODPTへの直接の問合せは行わないでください。<br />
            本アプリケーションに関するお問い合わせは、<br />
            githubのissues、もしくは、<br />
            zennの指定記事のコメント欄におよせください。<br />
            また、本アプリケーションの利用により生じた如何なる損害についても、<br />
            一切の責任を負いかねますので、ご了承ください。
          </p>
          <p>
            <Link href="https://github.com/YamateKyuko/busnum">github</Link>
            <Link href="https://github.com/YamateKyuko/busnum/issues">github issues</Link>
            <Link href="https://zenn.dev/yamakyu/articles/9fa8056628e92d">zenn コメント欄</Link>
            <Link href="https://www.odpt.org/">公共交通オープンデータセンター</Link>
          </p>
        </footer>
      </body>
    </html>
  );
};