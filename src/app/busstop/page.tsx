import Link from "next/link";

export default function Home() {
  return (
    <>
      <ul>
        <li>
          <h2>busnum busstop</h2>
        </li>
        <li>
          {/* バスの車番から車の詳細情報をお伝えします。<br />
          公共交通オープンデータセンターから提供された、<br />
          GTFS,GTFS-RTを読み取っています。 */}
        </li>
        <li>
          <h3>おねがい</h3>
          利用者の皆様におかれましては決して事業者様に迷惑をかけぬようお願いいたします。
        </li>

        <li>
          <Link href=''>busstop</Link>
        </li>
      </ul>
    </>
  );
};
