import { APIrequester } from '@/app/lib/request';
import { PS } from '../../../PS';
import styles from './rttimetable.module.css';
import { Time } from '@/app/lib/util';
import { tripUpdate } from '@/app/api/gtfsrt/busnum/tripUpdates/route';

export type pattern_times = {
  pattern_id: number,
  feed_id: number,
  route_id: string,
  trip_id: string,
  stop_sequence: number,
  stop_id: string,
  stop_headsign: string,
  arrival_time: number,
  departure_time: number,
  pickup_type: number,
  drop_off_type: number,
  route_name: string,
  stop_name: string,
  platform_code: string
};

type pattern_times_request = {
  date: string,
  pattern_ids: number[],
  stop_sequences: number[]
};

// type pattern_trips = {
//   feed_id: number,
//   trip_ids: string[]
// };

// type pattern_trips_request = {
//   date: string,
//   pattern_ids: number[],
//   stop_sequences: number[]
// };

const patternTimesRequester = new APIrequester<pattern_times[], pattern_times_request>(
  'gtfsdb/pattern_times', 'db'
);

type tripUpdatesTripsType = ([string, [tripUpdate]])[];
const tripUpdatesTripsRequester = new APIrequester<tripUpdatesTripsType, { date: string, feed_id: number, trip_ids: string[] }>(
  'gtfsrt/busnum/tripUpdates/trips', 'rt'
);

// const patternsRequester = new APIrequester<pattern_trips[], pattern_trips_request>(
//   'gtfsdb/pattern_times', 'db'
// );

export default async function Page(props: PageProps<'/busstop/timetable/rt/[[...patterns]]'>) {
  const {
    patterns: pattern_seqs = []
  } = await props.params;
  const {
    station_id
  } = await props.searchParams;

  const dateclass = new Date(Date.now());
  const PSs = new PS(pattern_seqs, dateclass);

  return (
    <li>
      <PatternRtTimeTable
        PSs={PSs}
      />
    </li>
  );
};

async function PatternRtTimeTable(props: { PSs: PS }) {
  const res = await patternTimesRequester.get({
    date: props.PSs.date,
    pattern_ids: props.PSs.pattern_ids,
    stop_sequences: props.PSs.stop_sequences
  });

  const trips: Map<number, string[]> = new Map();

  if (!res) return <div>No data found.</div>;

  res.forEach((st) => {
    const triplist = trips.get(st.feed_id);
    if (!triplist) {
      trips.set(st.feed_id, [st.trip_id]);
    } else {
      triplist.push(st.trip_id);
      trips.set(st.feed_id, triplist);
    }
  });

  const tripUpdates: Map<number, Map<string, [tripUpdate]>> = new Map();

  const promises: Promise<void>[] = [];
  trips.forEach((triplist, feed_id) => {
    const p = new Promise<void>(async (resolve) => {
      const r = await tripUpdatesTripsRequester.get({
        date: props.PSs.date,
        feed_id: feed_id,
        trip_ids: triplist
      });
      if (r === null || r.length === 0) {
        resolve();
        return;
      };
      const rmap = new Map(r);
      tripUpdates.set(feed_id, rmap);
      resolve();
      return;
    });

    promises.push(p);
  });

  await Promise.all(promises);
  
  // const r = Map.groupBy(res, (st) => st.feed_id);

  // const t = Array.from(r.entries());


  //   const trips = await patternTripsRequester.get({
  //   date: props.PSs.date,
  //   pattern_ids: [props.stoptime.pattern_id],
  //   stop_sequences: [props.stoptime.stop_sequence]
  // });

  if (!res) return <div>No data found.</div>;

  return (
    <dl className={styles.timetable}>
      {res.map((stoptime, i) => (
        <TimeComponent
          key={`${stoptime.trip_id}-${stoptime.stop_sequence}`}
          stoptime={stoptime}
          PSs={props.PSs}
          pdep={res[i-1]?.departure_time || null}
          tripUpdate={tripUpdates.get(stoptime.feed_id)?.get(stoptime.trip_id) || null}
        />
      ))}
    </dl>
  );
};

async function TimeComponent(props: { stoptime: pattern_times, PSs: PS, pdep: number | null, tripUpdate: [tripUpdate] | null }) {
  const time = Time.set(props.stoptime.departure_time);
  const tripUpdate = props.tripUpdate?.[0] || null;
  // const stopTimeUpdate = tripUpdate?.stop_time_update_list.find((v) => v.) || null;

  // props.tripUpdate && console.log(tripUpdate?.stop_time_update_list?.[0].stop_sequence);
  return (
    <>
      {/* {(ptime && ptime.h !== time?.h) && <br />}
      {(!ptime || (ptime && ptime.h !== time?.h)) &&
        <dt className={styles.timetableHour}>{time.h}</dt>
      } */}
      <dd className={styles.timetableCell}>
        {/* <Link
          href=''
          // href={`/busstop/bustime/${props.stoptime.trip_id}`}
        > */}
          {time.hm()}
          
          {props.stoptime.route_name}
          {props.stoptime.stop_headsign}
          {tripUpdate && <> - {tripUpdate.stop_time_update_list[0]?.departure_delay}</>}
          {props.stoptime.stop_name}
          {props.stoptime.platform_code}
          {/* <span>{props.PSs.getAB(props.stoptime.pattern_id, props.stoptime.stop_sequence)}</span> */}
        {/* </Link> */}
      </dd>
    </>
  );
};