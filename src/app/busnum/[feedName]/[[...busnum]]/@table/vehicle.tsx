import { APIrequester } from "@/app/lib/request";
import styles from "./styles.module.css";
import { vehicle } from "./table";

export type stopTime = {
  feed_id: number,
  trip_id: string,
  stop_id: string,
  stop_sequence: number,
  arrival_time: number,
  departure_time: number,
  stop_name: string,
  platform_code: string,
}

const tripRequester = new APIrequester<stopTime[]>(
  'gtfsdb/stop_times', 'db'
);

type tripUpdate = {
  stop_time_update_list: {
    stop_id: string,
    arrival_delay: number | null,
    departure_delay: number | null,
  }[]
};

const tripUpdatesRequester = new APIrequester<tripUpdate[]>(
  'gtfsrt/tripUpdates', 'rt'
);

export default async function Vehicle(props: {
  vehicle: vehicle
}) {
  const res = await tripRequester.get({
    feed_id: props.vehicle.feed_id,
    trip_id: props.vehicle.trip_id
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
        {res.map((stop) => 
          <li key={stop.stop_sequence}>
            {
              props.vehicle.stop_sequence == stop.stop_sequence &&
              <p className={`${
                props.vehicle.status == 0 ? styles.incoming :
                props.vehicle.status == 1 ? styles.stopped :
                props.vehicle.status == 2 ? styles.inTransit :
                ''} ${styles.status}
              `}>{
                props.vehicle.status == 0 ? '接近' :
                props.vehicle.status == 1 ? '停車' :
                props.vehicle.status == 2 ? '走行' :
                ''
              }</p>
            }
            <p className={styles.time}>
              {(
                () => {
                  const update = tripUpdate?.stop_time_update_list.find((tu) => tu.stop_id == stop.stop_id);
                  const time = (n: number, d: number | undefined, b: boolean) => {
                    const t = n + (d || 0);
                    return <>
                      {d && Math.abs(d) > 30 &&
                        <span>約<span>{Math.round(d / 60)}</span>分{d > 0 ? '遅れ' : '早発'}</span>
                      }
                      {Math.trunc(t / 3600).toString().padStart(2, '0')}:
                      {Math.trunc((t % 3600) / 60).toString().padStart(2, '0')}
                      {b ? '着' : '発'}
                      {props.vehicle.stop_sequence <= stop.stop_sequence && '見込'}
                    </>;
                  };
                  if (!update) return time(stop.departure_time, undefined, false);
                  if (update?.departure_delay) return time(stop.departure_time, update.departure_delay, false);
                  if (update?.arrival_delay) return time(stop.arrival_time, update.arrival_delay, true);
                  return '';
                })(
              )}
              
            </p>
            <h3>
              {stop.stop_name}
              <span>{stop.platform_code}</span>
            </h3>
          </li>
        )}
    </ul>
    </>
  );
};