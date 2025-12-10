import { APIrequester } from "@/app/lib/request";
import { Time } from "@/app/lib/util";
import styles from '@/app/busstop/timetable/[[...patterns]]/timetable.module.css';

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
  drop_off_type: number
};

type pattern_times_request = {
  pattern_ids: number[],
  stop_sequences: number[]
};

type pattern_request = {
  pattern_ids: number[],
  stop_sequences: number[]
};

type pattern = {
  pattern_id: number,
  feed_id: number,
  route_id: string,
  route_name: string,
  stop_sequence: number,
  stop_id: string,
  stop_name: string,
  stop_headsign: string,
  zone_id: string,
};

const patternTimesRequester = new APIrequester<pattern_times[], pattern_times_request>(
  'gtfsdb/pattern_times', 'db'
);

const patternRequester = new APIrequester<pattern[], pattern_times_request>(
  'gtfsdb/patterns', 'db'
);

type pso = {
  pattern_id: number,
  stop_sequence: number,
  index: number,
  ab: string
};

class PS {
  pattern_ids: number[] = [];
  stop_sequences: number[] = [];
  tbl: Map<`${number}_${number}`, pso> = new Map();

  constructor(values: string[]) {
    values.forEach((v, i) => {
      const [p, s] = v.split('_').map((n) => Number(n));
      if (!p || !s || isNaN(p) || isNaN(s)) return;
      this.tbl.set(`${p}_${s}`, {
        pattern_id: p,
        stop_sequence: s,
        index: i,
        ab: PS.convABC(i)
      });
      this.pattern_ids.push(p);
      this.stop_sequences.push(s);
    });
  };

  getIndex(p: number, s: number): number | null {
    const o = this.get(p, s);
    if (!o) return null;
    return o.index;
  };

  static convABC(v: number): string {
    return String.fromCharCode(...[(v > 25) ? (Math.floor(v / 26) + 64): [], (v % 26) + 65].flat());
  };

  getAB(p: number, s: number): string | null {
    const o = this.get(p, s);
    if (!o) return null;
    return o.ab;
  }

  get(p: number, s: number): pso | null {
    const o = this.tbl.get(`${p}_${s}`);
    if (!o) return null;
    return o;
  }
}



export default async function Page(props: PageProps<'/busstop/timetable/[[...patterns]]'>) {
  const {
    patterns: pattern_seqs = []
  } = await props.params;
  const {
    station_id
  } = await props.searchParams;

  const PSs = new PS(pattern_seqs);

  return (
    <ul>
      <li>
        パターン別時刻表
      </li>
      <li>
        <PatternTable
          PSs={PSs}
        />
      </li>
      <li>
        <PatternTimeTable
          PSs={PSs}
        />
      </li>
    </ul>
  )
};

async function PatternTable(props: { PSs: PS }) {
  const r = await patternRequester.get({
    pattern_ids: props.PSs.pattern_ids,
    stop_sequences: props.PSs.stop_sequences
  });
  if (!r) return <div>No data found.</div>;

  // const aa = r[0];
  // if (!aa) return <div>No data found.</div>;
  // console.log(aa);
  // console.log(props.PSs);
  // console.log(props.PSs.getAB(1, 3));

  return (
    <ul>
      {r.map((pattern, i) => (
        <li key={i}>
          {props.PSs.getAB(pattern.pattern_id, pattern.stop_sequence)}-
          {pattern.route_name} {pattern.stop_name} {pattern.stop_headsign}
        </li>
      ))}
    </ul>
  )
};

async function PatternTimeTable(props: { PSs: PS }) {
  const res = await patternTimesRequester.get({
    pattern_ids: props.PSs.pattern_ids,
    stop_sequences: props.PSs.stop_sequences
  });

  if (!res) return <div>No data found.</div>;

  return (
    <dl>
      {res.map((stoptime, i) => (
        <TimeComponent
          key={`${stoptime.trip_id}-${stoptime.stop_sequence}`}
          stoptime={stoptime}
          PSs={props.PSs}
          pdep={res[i-1]?.departure_time || null}
        />
      ))}
    </dl>
  );
};

async function TimeComponent(props: { stoptime: pattern_times, PSs: PS, pdep: number | null }) {
  const time = Time.set(props.stoptime.departure_time);
  const ptime = Time.set(props.pdep);
  return (
    <>
      {(ptime && ptime.h !== time?.h) && <br />}
      {(!ptime || (ptime && ptime.h !== time?.h)) &&
        <dt className={styles.timetableHour}>{time.h}</dt>
      }
      <dd className={styles.timetableCell}>
        {time.m}
        <span>{props.PSs.getAB(props.stoptime.pattern_id, props.stoptime.stop_sequence)}</span>
      </dd>
    </>
  );
};