import { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "busnum",
  description: "Bus Navigation app",
  icons: [{rel: 'icon', url: '/icon.svg'}],
};

export default async function Layout(props: LayoutProps<'/'>) {
  return (
    <html lang="ja">
      <body>
        <header className={styles.header}>
          <Link
            href="/busnum"
          >
            <Image
              src="/busnum4logo.svg"
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
            公共交通オープンデータセンターにおいて提供されるものです。<br />
            公共交通事業者により提供されたデータを元にしていますが、<br />
            必ずしも正確・完全なものとは限りません。<br />
            本アプリケーションの表示内容について、<br />
            公共交通事業者への直接の問合せは行わないでください。<br />
            本アプリケーションに関するお問い合わせは、<br />
            以下のメールアドレスにお願いします。<br />
          </p>
          <p>
            <a href="mailto:Yamate.kyuko@gmail.com">Yamate.kyuko@gmail.com</a>
          </p>
        </footer>
      </body>
    </html>
  );
};