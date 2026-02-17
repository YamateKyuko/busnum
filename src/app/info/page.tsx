import Link from "next/link";
import Image from "next/image";

function Page() {
  return (
    <>
      <ul>
        <li>
          <h3>システム情報</h3>
        </li>
        <li>
          <h4>1.名称</h4>
          <p>「バスナム」</p>
          バス車両番号検索サービス
        </li>
        <li>
          <h4>2.公開URL</h4>
          <Link href="https://busnum.vercel.app/busnum/">バスナム</Link><br />
          <Link href="https://busnum25.vercel.app/busnum/">archived version</Link>
        </li>
        <li>
          <h4>3.説明</h4>
          バスナムは車両番号を入力することで、<br />
          バスがどの停留所を、いつ通過するのか、現在地はどこなのかがすぐにわかるシステムです。<br />
          現在、多くのバス会社が、自社の車両を特定するための識別番号をバスにペイントしています。<br />
          京王バスだと、右のヘッドライトのそばや、左側面の窓の車端側にあったりします。<br />
          gtfs-realtimeフィードで提供される車両番号と照らし合わせて、バスを特定し、<br />
          その車両の系統番号、行先、位置、遅延情報、バス停の通過時刻、運賃などを提供するバスナムを使えば、<br />
          もう、バスの運転士さんに「○○に行きますか」と尋ねる必要はありません。<br />
          また、車両番号は主に数字とアルファベットで構成されるため、<br />
          翻訳情報の表示に対応したバスナムは外国人旅客でも簡単に使えます。<br />
          バス車内に設置する端末としても活用可能なバスナムは、<br />
          バスの撮影のお供にも最適です。<br />
          現在、京王バス、西武バス、都営バスに対応しています。
        </li>
        <li>
          <h4>4.紹介資料</h4>
          <Link href='/busnum.pdf'>PDF</Link>
        </li>
        <li>
          <h4>5.紹介動画のURL</h4>
          <Link href='https://youtu.be/XdVIGR3mnn8'>バスナムのご案内</Link>
        </li>
        <li>
          <h4>6.写真やスクリーンショットなど</h4>
          {/* 1125 × 2436  */}
          <details>
            <summary>画像</summary>
            <Image
              src="/busnumView.png"
              alt="busnum screenshot"
              width={1125/5}
              height={2436/5}
            />
            <Image
              src="/busnumEnglishView.png"
              alt="busnum screenshot"
              width={1125/5}
              height={2436/5}
            />
            <Image
              src="/busnumTimetableView.jpeg"
              alt="busnum screenshot"
              width={1125/5}
              height={2436/5}
            />
          </details>
          
        </li>
        <li>
          <h4>7.マニュアルのURL</h4>
          <Link href="/busnum/howto">howto</Link><br />
        </li>
        <li>
          <h4>8.使用したオープンデータ</h4>
          * 公共交通オープンデータセンター: https://ckan.odpt.org/<br />
          　- 京王バスのGTFS,GTFS-RTデータ<br />
          　- 東京都交通局の都営バスのGTFS・GTFS-RTデータ<br />
          　- 西武バスのGTFS,GTFS-RTデータ
        </li>
      </ul>
    </>
  );
};

export default Page;