import feedList from "@/app/api/common/feedList";
import { busNumSearchParamName } from "../@form/page";
import { feedNameParamName, busNumParamName, isFareDispParamName, langparamName } from "../layout";
import Table from "./table";
import { Suspense } from "react";
export const revalidate = 0;

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
  const langParam = (await props.searchParams)[langparamName] || null;

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
      
      {/* <li>テーブル{paramStr}</li> */}
      <Suspense fallback={<li>検索中</li>}>
        <Table
          feedName={feedName}
          busnum={paramStr}
          selected={busNum}
          faredisp={isFareDispParam == 'true'}
          lang={langParam}
        />
      </Suspense>
    </ul>
  );
};

// const Test = () => {
//   const busNum = '2345';
  
//   const vehicleNumObj = feedList['keiobus']?.vehicleNumObj;
  
//   if (!vehicleNumObj || vehicleNumObj == true) return <div>test</div>;
//   const form = vehicleNumObj.vehicleNumAvailableFormat.find((f) => f.length == busNum.length);
//   if (!form) return <div>test</div>;
//   const descForm = vehicleNumObj.vehicleNumFormat;
  

//   const vehicleData: {description: string}[] = [{description: '12345'}, {description: '22345'}];
  
//   const res = vehicleData.filter(
//     (vehicle) => {
//       let bool = true;
//       for (const [i, s] of form.entries()) {
//         if (vehicle.description?.charAt(descForm.indexOf(s)) != busNum.charAt(i)) bool = false;
//         // return true;
//       };
//       return bool;
//     }
//   );
//   console.log(res);
//   return <div>test</div>;
// }