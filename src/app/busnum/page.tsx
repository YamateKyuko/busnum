import Image from "next/image";
import feedList from "../api/common/feedList";
import Link from "next/link";

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
          <details>
            <summary>
              京王バス
            </summary>
            数字 3・5 桁でお願いします。<br />
            アルファベット(営業所記号)は省略してください。<br />
            車番はバスの各所に配されています。<br />
            一例です。YNNもしくはMYYNNでご入力ください。
            <dl>
              <dt>前面・OYNN</dt>
              <dd>右ヘッドライトの上もしくは左</dd>
              <dt>左面・OMYYNN</dt>
              <dd>窓の右下端もしくはその下</dd>
              <dt>右面・OMYYNN</dt>
              <dd>窓の下左端</dd>
              <dt>背面・YNN</dt>
              <dd>テールランプ周辺</dd>
              <dt>天面・MYYNN</dt>
              <dd>中央</dd>
            </dl>
            <dl>
              <dt>O・営業所</dt>
              <dt>M・メーカ</dt>
              <dt>YY・導入年下二桁</dt>
              <dt>NN・固有番号</dt>
            </dl>
          </details>
        </li>
        <li>
          <details>
            <summary>
              都営バス
            </summary>
            アルファベット + 数字3桁で入力してください。<br />
            最初のアルファベット(営業所記号)は省略してください。<br />
            車番はバスの各所に配されています。<br />
            一例です。YNNNでご入力ください。
            <dl>
              <dt>前面・YNNN</dt>
              <dd>右ヘッドライトの上もしくは左</dd>
              <dt>左面・O-YNNN</dt>
              <dd>窓の右下端もしくはその下</dd>
              <dt>右面・O-YNNN</dt>
              <dd>窓の下左端</dd>
              <dt>背面・YNNN</dt>
              <dd>テールランプ周辺</dd>
              <dt>天面・YNNN</dt>
              <dd>中央下部</dd>
            </dl>
            <dl>
              <dt>O・営業所</dt>
              <dt>Y・導入年アルファベット1桁</dt>
              <dt>NNN・固有番号</dt>
            </dl>
          </details>
        </li>
      </ul>
    </>
  );
};
