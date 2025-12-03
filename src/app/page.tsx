import Link from "next/link";

export default function Home() {
  return (
    <>
      <ul>
        <li>
          <h2>busnum system</h2>
        </li>
        <li>
          <Link href="/busnum">busnum</Link>
        </li>
        <li>
          <Link href="/busstop">busnum busstop</Link>
        </li>
        <li>
          <Link href="/busnum/info">公共交通オープンデータチャレンジ2025応募情報</Link>
        </li>
      </ul>
    </>
  );
}