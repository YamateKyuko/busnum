import Image from "next/image";
import feedList from "../api/common/feedList";
import Link from "next/link";
import { KeioBusManual, ToeiBusManual } from "./manual";

export default function Home() {
  return (
    <>
      <ul>
        <li>
          <Image
            src="/busnum4logo.svg"
            alt="BusNum Logo"
            width={400}
            height={100}
          />
        </li>
        <li>
          バスの車番から車の詳細情報をお伝えします。<br />
          公共交通オープンデータセンターから提供された、<br />
          GTFS,GTFS-RTを読み取っています。
        </li>
        <li>
          <h3>おねがい</h3>
          本アプリケーションは明文化されていないフィードの仕様を利用したものであり、<br />
          仕様の変更によりシステムが使えなくなる可能性があります。<br />
          {/* 本アプリケーションの内容につきましての問題が発生すると、<br /> */}
          {/* フィードの仕様変更によりシステムが動作しなくなる可能性があります。<br /> */}
          利用者の皆様におかれましては決して事業者様に迷惑をかけぬようお願いいたします。
        </li>
        {Object.entries(feedList).map(([name, feed]) => (
          <li key={name}>
            <Link href={`/busnum/${name}`} style={feed.vehicleNumObj ? {} : {display: "none"}}>
              <h3>{feed.name}</h3>
            </Link>
          </li>
        ))}
        <li>
          <h3>使い方</h3>
          <KeioBusManual />
          <ToeiBusManual />
        </li>
        <li>
          <Link href="/busnum/info">公共交通オープンデータチャレンジ2025応募情報</Link>
        </li>
      </ul>
    </>
  );
};
