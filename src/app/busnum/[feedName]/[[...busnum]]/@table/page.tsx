import feedList from "@/app/api/common/feedList";
import { busNumSearchParamName } from "../@form/page";
import { feedNameParamName, busNumParamName, isFareDispParamName } from "../layout";
import Table from "./table";
import { Suspense } from "react";
import Link from "next/link";

export default async function Page(props: {
  params: Promise<{[feedNameParamName]?: string, [busNumParamName]?: string[], [isFareDispParamName]?: string
  }>,
  searchParams: Promise<{[key: string]: string}>,
}) {
  const {
    [feedNameParamName]: feedName,
    [busNumParamName]: busNumParam,
  } = await props.params;
  if (!feedName) {return <>フィード名が指定されていません</>};
  if (busNumParam && busNumParam.length != 1) {return <>パスの車番の指定が不正です</>};
  const busNum = busNumParam?.[0] || null;
  const feedObj = feedList[feedName];
  if (!feedObj) {return <>このフィード名はありません。</>};
  const vehicleNumObj = feedObj.vehicleNumObj;
  if (!!!vehicleNumObj) {return <>このフィード名に対して情報を提供していません。</>;};

  const searchBusNum = (await props.searchParams)[busNumSearchParamName];
  const isFareDispParam = (await props.searchParams)[isFareDispParamName];
  if (!searchBusNum) return <>車番が指定されていません。</>;
  const paramStr = Array.from(searchBusNum).map((s) => {
    if (s.match(/[A-Z]/)) return s;
    if (s.match(/[a-z]/)) return s.toUpperCase();
    if (s.match(/[0-9]/)) return s;
    if (s.match(/[０-９]/)) return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    return [];
  }).flat().join('');

  if (vehicleNumObj != true) {
    const availableBusNumLength = vehicleNumObj.vehicleNumAvailableFormat.map(
      (format) => format.length
    );
  
    if (
      !availableBusNumLength.includes(paramStr.length)
    ) return <>車番が不正です。入力方法をご確認ください。</>;  
  }

  

  return (
    <ul>
      {isFareDispParam !== 'true' &&
        <li>
          <Link href='?fare=true'>運賃表示モードへ</Link>
        </li>
      }
      <li>テーブル{paramStr}</li>
      <Suspense fallback={<li>検索中</li>}>
        <Table feedName={feedName} busnum={paramStr} selected={busNum} faredisp={isFareDispParam == 'true'} />
      </Suspense>
      
    </ul>
  );
};