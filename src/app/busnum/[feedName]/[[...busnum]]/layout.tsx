import feedList from "@/app/api/common/feedList";

export const feedNameParamName = "feedName";
export const busNumParamName = "busnum";
export const isFareDispParamName = "fare";


export default async function BusNum(props: {
  form: React.ReactNode,
  table: React.ReactNode,
  params: Promise<{[feedNameParamName]?: string, [busNumParamName]?: string[], [isFareDispParamName]?: string }>,
}) {
  const {
    [feedNameParamName]: feedName,
    [busNumParamName]: busNum,
    // [isFareDispParamName]: isFareDispParam
  } = await props.params;
  if (!feedName) {return <>このフィード名がありません。</>;};
  if (busNum && busNum.length != 1) {return <>車番の指定が間違っています。</>;};
  const feedObj = feedList[feedName];
  if (!feedObj?.vehicleNumObj) {return <>このフィード名に対して情報を提供していません。</>;}

  return (
    <>
      {props.form}
      {props.table}
    </>
  );
};

// export const generateStaticParams = Object.entries(feedList).map(([key, feed]) => {
//   if (!feed.vehicleNumObj) return [];
//   return {
//     path: `/${key}`,
//     params: {[feedNameParamName]: key}
//   }
// }).flat();