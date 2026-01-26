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
  timestamp: number,
};

export type vehicle_request = {
  feedName: string,
  busNum: string
};

const vehiclePositionRequester = new APIrequester<vehicle[], vehicle_request>(
  'gtfsrt/busnum/vehicleposition', 'rt'
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
  route_name_translation?: string | null,
  stop_name_translation?: string | null,
  stop_headsign_translation?: string | null,
};

type stop_patterns_request = {
  feed_id: number,
  trip_id: string[],
  stop_id: string[],
  lang?: string | null,
}

const stopPatternsRequester = new APIrequester<stopPattern[], stop_patterns_request>(
  'gtfsdb/stop_patterns', 'db'
);

export default async function Table(props: {
  feedName: string,
  busnum: string,
  selected: string | null,
  faredisp?: boolean,
  lang?: string | null,
}) {
  const vehicles = await vehiclePositionRequester.get({
    feedName: props.feedName,
    busNum: props.busnum
  });
  if (!vehicles) return <></>;

  // console.log(vehicles);

  const tripIds = vehicles.map((vehicle) => vehicle.trip_id);

  const stopPatterns = await stopPatternsRequester.get({
    feed_id: vehicles[0]?.feed_id || 0,
    trip_id: tripIds,
    stop_id: vehicles.map((vehicle) => vehicle.stop_id),
    lang: props.lang || null,
  });

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
                  lang={props.lang}
                />
              }
            />
            {(props.selected == vehicle.description || vehicles.length == 1) && (
              <Vehicle
                vehicle={vehicle}
                faredisp={!!props.faredisp}
                lang={props.lang}
              />
            )}
          </details>
        </li>
      )}

      {vehicles.length === 0 &&
        <li>
          {/* ごめんなさい。ごめんなさい。<br /> */}
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

const GetRouteElm = (props: {ptn: stopPattern | null, desc: string, vehicle: vehicle, lang?: string | null} ) => {
  return (
    <>
      <p className={styles.vehicleNumber}>{props.desc}</p>
      <p className={styles.vehicleTimestamp}>
        {props.lang == 'en' && <span>Fetched in </span>}
        {
          new Date((props.vehicle.timestamp % 86400) * 1000)
            .toLocaleTimeString('ja-JP', {
              timeZone: 'Asia/Tokyo',
            })
        }
        {(props.lang == 'ja' || !props.lang) && <span>現在</span>}
      </p>
      <h3 className={styles.tripDesc}>
        <span className="routeName">{props.ptn?.route_name_translation || props.ptn?.route_name}</span>
        {props.ptn?.stop_headsign_translation || props.ptn?.stop_headsign}
      </h3>
      
      {
        props.lang == 'en' ?
          <p className={styles.stopDesc}>
            {props.vehicle.status == 0 && <><span>Arrving</span> at </>}
            {props.vehicle.status == 1 && <><span>Stopping</span> at </>}
            {props.vehicle.status == 2 && <><span>Running</span> to </>}
            <span>{props.ptn?.stop_name_translation || props.ptn?.stop_name}</span>
            .
          </p> :
        props.lang == 'ja-Hrkt' ?
          <p className={styles.stopDesc}>
            <span>{props.ptn?.stop_name_translation || props.ptn?.stop_name}</span>
            {props.vehicle.status == 0 && <>に<span>ちかづいて</span>います</>}
            {props.vehicle.status == 1 && <>で<span>とまって</span>います</>}
            {props.vehicle.status == 2 && <>へ<span>むかって</span>います</>}
            
          </p> :
        props.lang == 'ja' || !!props.lang ? 
          <p className={styles.stopDesc}>
            ただいま
            <span>{props.ptn?.stop_name_translation || props.ptn?.stop_name}</span>
            {props.vehicle.status == 0 && <>に<span>接近</span>中</>}
            {props.vehicle.status == 1 && <>で<span>停車</span>中</>}
            {props.vehicle.status == 2 && <>へ<span>走行</span>中</>}
          </p> :
        !props.lang ?
          <p className={styles.stopDesc}>
            ただいま
            <span>{props.ptn?.stop_name_translation || props.ptn?.stop_name}</span>
            {props.vehicle.status == 0 && <>に<span>接近</span>中</>}
            {props.vehicle.status == 1 && <>で<span>停車</span>中</>}
            {props.vehicle.status == 2 && <>へ<span>走行</span>中</>}
          </p> : <></>
      }
      
      
    </>
  );
};