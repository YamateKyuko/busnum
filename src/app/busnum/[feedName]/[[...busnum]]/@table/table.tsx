import { APIrequester } from "@/app/lib/request";
import Vehicle from "./vehicle";
import VehicleButton from "./vehicleButton";
import { busNumParamName } from "../layout";
import styles from "./styles.module.css";

export type vehicle = {
  id: string,
  description: string,
  feed_id: number,
  trip_id: string,
  stop_id: string,
  schedule_relationship: number,
  stop_sequence: number,
  status: number, // 0: INCOMING_AT, 1: STOPPED_AT, 2: IN_TRANSIT_TO
};

const vehiclePositionRequester = new APIrequester<vehicle[]>(
  'gtfsrt/vehicleposition', 'rt'
);

export type stopPattern = {
  feed_id: number,
  route_id: string,
  trip_id: string,
  route_name: string,
  route_type: number,
  stop_sequence: number,
  stop_name: string,
  stop_headsign: string,
};

const stopPatternsRequester = new APIrequester<stopPattern[]>(
  'gtfsdb/stop_patterns', 'db'
);

export default async function Table(props: {
  feedName: string,
  busnum: string,
  selected: string | null
}) {
  const vehicles = await vehiclePositionRequester.get({
    feedName: props.feedName,
    busNum: props.busnum
  });
  if (!vehicles) return <></>;

  const tripIds = vehicles.map((vehicle) => vehicle.trip_id);

  const stopPatterns = await stopPatternsRequester.get({
    feed_id: vehicles[0]?.feed_id || 0,
    trip_id: tripIds,
    stop_id: vehicles.map((vehicle) => vehicle.stop_id)
  });

  const GetRouteElm = (props: {ptn: stopPattern | null, desc: string, vehicle: vehicle} ) => {
    return (
      <>
        <p className={styles.vehicleNumber}>{props.desc}</p>
        <h3 className={styles.tripDesc}>
          <span className="routeName">{props.ptn?.route_name}</span>
          {props.ptn?.stop_headsign}
        </h3>
        <p className={styles.stopDesc}>
          ただいま<span>{props.ptn?.stop_name}</span>
          {props.vehicle.status == 0 && 'に接近中'}
          {props.vehicle.status == 1 && 'に停車中'}
          {props.vehicle.status == 2 && 'へ走行中'}
        </p>
      </>
    );
  };

  return (
    <>
      {vehicles.map((vehicle) => 
        <li key={vehicle.trip_id} className={styles.vehicle}>
          <details open={props.selected === vehicle.description || vehicles.length == 1}>
            <VehicleButton
              val={vehicle.description}
              paramName={busNumParamName}
              elm={
                <GetRouteElm
                  ptn={stopPatterns && stopPatterns.find((route) => route.trip_id === vehicle.trip_id) || null}
                  desc={vehicle.description}
                  vehicle={vehicle}
                />
              }
            />
            {(props.selected == vehicle.description || vehicles.length == 1) && (
              <Vehicle
                vehicle={vehicle}
              />
            )}
          </details>
        </li>
      )}

      {vehicles.length === 0 &&
        <li>
          ごめんなさい。ごめんなさい。<br />
          結果が見つかりませんでした。<br />
          次の要因が考えられます。
          <dl>
            <dt>フィードの仕様変更。</dt>
            <dd>諦めてください。</dd>
            <dt>プログラムのバグ。</dt>
            <dd>Issueで教えてください。</dd>
            <dt>データが提供されていない。</dt>
            <dd>営業中でない車のデータはありません。</dd>
            <dt>入力した番号が間違っている。</dt>
            <dd>もう一度入力方法をご確認ください。</dd>
          </dl>
        </li>
      }

      {vehicles.length > 0 &&
        <li>
          結果はこれだけです。<br />
          営業中でない車のデータはありません。
        </li>
      }
      
    </>
  );
};