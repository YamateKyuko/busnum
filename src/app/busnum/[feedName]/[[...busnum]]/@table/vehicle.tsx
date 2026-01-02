import { APIrequester } from "@/app/lib/request";
import styles from "./styles.module.css";
import { vehicle } from "./table";
import { Time } from "@/app/lib/util";
import { tripUpdate } from "@/app/api/gtfsrt/busnum/tripUpdates/route";

export type stopTime = {
  feed_id: number,
  trip_id: string,
  stop_id: string,
  stop_sequence: number,
  arrival_time: number,
  departure_time: number,
  stop_name: string,
  platform_code: string,
  price?: number,
  stop_name_translation?: string | null,
};

type stop_time_request = {
  feed_id: number,
  trip_id: string,
  stop_sequence?: number | null,
  lang?: string | null,
}

const timesRequester = new APIrequester<stopTime[], stop_time_request>(
  'gtfsdb/stop_times', 'db'
);

// export type tripUpdate = {
  
//   stop_time_update_list: {
//     stop_id: string,
//     stop_sequence: number,
//     arrival_delay: number | null,
//     departure_delay: number | null,
//     arrival_uncertainly: number | null,
//     departure_uncertainly: number | null,
//   }[]
// };

// type trip_update_request = {
//   feed_id: number,
//   trip_id: string
// };

const tripUpdatesRequester = new APIrequester<tripUpdate[], stop_time_request>(
  'gtfsrt/busnum/tripUpdates', 'rt'
);

export default async function Vehicle(props: {
  vehicle: vehicle,
  faredisp?: boolean,
  lang?: string | null,
}) {
  const res = await timesRequester.get({
    feed_id: props.vehicle.feed_id,
    trip_id: props.vehicle.trip_id,
    stop_sequence: props.faredisp ? (props.vehicle.stop_sequence || null) : null,
    lang: props.lang || null,
  });
  const TUres = await tripUpdatesRequester.get({
    feed_id: props.vehicle.feed_id,
    trip_id: props.vehicle.trip_id
  });
  if (!res) return;

  const tripUpdate = TUres?.[0] || null;

  return (
    <>
      <ul className={styles.stopList}>
        {res.map((stop: stopTime) => 
          <li key={stop.stop_sequence} id={`${stop.stop_sequence}^${stop.stop_id}`}>
            {
              props.vehicle.stop_sequence == stop.stop_sequence ?
              <p className={`${
                props.vehicle.status == 0 ? styles.incoming :
                props.vehicle.status == 1 ? styles.stopped :
                props.vehicle.status == 2 ? styles.inTransit :
                ''} ${styles.status}
              `}>
              {
                props.lang == 'en' ? <>{
                  props.vehicle.status == 0 ? 'incoming' :
                  props.vehicle.status == 1 ? 'stopped' :
                  props.vehicle.status == 2 ? 'intransit' :
                  ''
                }</> :
                props.lang == 'ja-Hrkt' ? <>{
                  props.vehicle.status == 0 ? 'せっきん' :
                  props.vehicle.status == 1 ? 'ていしゃ' :
                  props.vehicle.status == 2 ? 'そうこう' :
                  ''
                }</> :
                (props.lang == 'ja' || !props.lang) ? <>{
                  props.vehicle.status == 0 ? '接近' :
                  props.vehicle.status == 1 ? '停車' :
                  props.vehicle.status == 2 ? '走行' :
                  ''
                }</> : <></>
              }
              
              </p>
              : <p className={styles.status}></p>
            }
            <div>
              <p className={styles.time}>
                <TimeComponent
                  tripUpdate={tripUpdate}
                  stop={stop}
                  vehicle={props.vehicle}
                  lang={props.lang || null}
                />
              </p>
              <h3 className={styles.stopName}>
                {stop.stop_name_translation || stop.stop_name}
                <span>({stop.platform_code})</span>
                
              </h3>
              {(props.faredisp && stop.price) && <p className={styles.fare}>¥{stop.price}</p>}
              
            </div>
          </li>
        )}
    </ul>
    </>
  );
};

const TimeComponent = (props: {tripUpdate: tripUpdate | null, stop: stopTime, vehicle: vehicle, lang?: string | null}) => {
  const update = props.tripUpdate?.stop_time_update_list.find((tu) => tu.stop_id == props.stop.stop_id);
  const time = (n: number, d: number | undefined, b: boolean) => {
    const t = n + (d || 0);
    return (
      <>
        {d && Math.abs(d) > 30 &&
          <span>
            {
              props.lang == 'en' ? 'About ' :
              props.lang == 'ja-Hrkt' ? 'やく' :
              (props.lang == 'ja' || !props.lang) ? '約' : ''
            }
            <span>
              {Math.round(d / 60)}
            </span>
            {
              props.lang == 'en' ? ' min' :
              props.lang == 'ja-Hrkt' ? 'ふん' :
              (props.lang == 'ja' || !props.lang) ? '分' : ''
            }
            {
              props.lang == 'en' ? (d > 0 ? ' late' : ' early') :
              props.lang == 'ja-Hrkt' ? (d > 0 ? 'おくれ' : 'そうはつ') :
              (props.lang == 'ja' || !props.lang) ? (d > 0 ? '遅れ' : '早発') : ''
            }
          </span>
        }
        <span> 
          {
            props.lang == 'en' ? (b ? 'Arrive at ' : 'Departure at ') :
            props.lang == 'ja-Hrkt' ? '' :
            (props.lang == 'ja' || !props.lang) ? '' : ''
          }
          <span>{Time.set(t).hms()}</span>
          {
            props.lang == 'en' ? '' :
            props.lang == 'ja-Hrkt' ? `${b ? 'とうちゃく' : 'はっしゃ'}${props.vehicle.stop_sequence <= props.stop.stop_sequence ? 'みこみ' : ''}` :
            (props.lang == 'ja' || !props.lang) ? `${b ? '着' : '発'}${props.vehicle.stop_sequence <= props.stop.stop_sequence ? '見込' : ''}` : ''
          }
        </span>
      </>
    );
  };
  if (!update) return time(props.stop.departure_time, undefined, false);
  if (update.departure_delay !== null) return time(props.stop.departure_time, update.departure_delay, false);
  if (update.departure_uncertainly !== null) return time(props.stop.departure_time, undefined, false);
  if (update.arrival_delay !== null) return time(props.stop.arrival_time, update.arrival_delay, true);
  if (update.arrival_uncertainly !== null) return time(props.stop.arrival_time, undefined, false);
  return time(props.stop.departure_time, undefined, false);
  // return '';
}