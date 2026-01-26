import Link from "next/link";
import { KeioBusManual, ToeiBusManual } from "../manual";
import Image from "next/image";

export default async function Page(props: PageProps<'/busnum/howto'>) {
  return (
    <ul>
      <li>
        <h3>バスナムの使い方</h3>
      </li>
      <li>
        1. <Link href='/busnum/'>トップ</Link>より、検索するバス会社を選択します。<br />
        2. バスの車両番号を形式にしたがって入力します。<br />
        <details>
          <summary>例</summary>
          <Image
            src="/bus.png"
            alt="howto1"
            width={2956/10}
            height={3941/10}
          /><br />
          この車でしたら、左ヘッドライトの左の107を入力してください。<br />
        </details>
        3. バスのサインや長い車両番号を参考に、車両を特定し開きます。<br />
        4. 右上のハンバーガメニューより、言語設定や運賃表示を設定いただけます。<br />
        <Link href='https://youtu.be/XdVIGR3mnn8'>動画</Link>も参考にしてください。<br />
        <Link href='/busnum.pdf'>pdf</Link>
      </li>
      <li>
        <h4>バス車両番号の位置案内</h4>
      </li>
      <KeioBusManual />
      <ToeiBusManual />
      <li>
        <h4>ご利用にあたって</h4>
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
      </li>
      
    </ul>
  );
};