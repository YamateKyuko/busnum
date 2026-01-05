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
          この車でしたら、左ヘッドライトの左上の107を入力してください。<br />
        </details>
        3. バスのサインや長い車両番号を参考に、車両を特定し開きます。<br />
        4. 右上のハンバーガメニューより、言語設定や運賃表示のを設定いただけます。<br />
        <Link href='https://youtu.be/XdVIGR3mnn8'>動画</Link>も参考にしてください。
      </li>
      <li>
        <h4>バス車両番号の位置案内</h4>
      </li>
      <KeioBusManual />
      <ToeiBusManual />
    </ul>
  );
};