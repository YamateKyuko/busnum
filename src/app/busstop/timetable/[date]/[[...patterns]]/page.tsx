import { APIrequester } from "@/app/lib/request";
import { Time } from "@/app/lib/util";
import styles from './timetable.module.css';
import Link from "next/link";
import { ChangeEventHandler } from "react";

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
  date: string,
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
  first_stop_name: string
};

const patternTimesRequester = new APIrequester<pattern_times[], pattern_times_request>(
  'gtfsdb/pattern_times', 'db'
);

const patternRequester = new APIrequester<pattern[], pattern_request>(
  'gtfsdb/patterns', 'db'
);

type pso = {
  pattern_id: number,
  stop_sequence: number,
  index: number,
  ab: string,
  color: string
};

class PS {
  pattern_ids: number[] = [];
  stop_sequences: number[] = [];
  tbl: Map<`${number}_${number}`, pso> = new Map();
  date: string;

  constructor(values: string[], d: string) {
    this.date = d;
    values.forEach((v, i) => {
      const [p, s] = v.split('_').map((n) => Number(n));
      if (!p || !s || isNaN(p) || isNaN(s)) return;
      this.tbl.set(`${p}_${s}`, {
        pattern_id: p,
        stop_sequence: s,
        index: i,
        ab: PS.convABC(i),
        color: 'black'
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

  getColor(p: number, s: number): string | null {
    const o = this.get(p, s);
    if (!o) return null;
    return o.color;
  }

  // setColor(p: number, s: number, c: string): void {
  //   const o = this.get(p, s);
  //   if (!o) return;
  //   o.color = c;
  // }

  // setColorHandler: ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(event)
  //   // return (e) => {
  //   //   const [p, s] = event.target.value.split('_').map((n) => Number(n));
  //   //   this.setColor(p, s, e.target.value);
  //   // };
  // }
}



export default async function Page(props: PageProps<'/busstop/timetable/[date]/[[...patterns]]'>) {
  const {
    date: dateparam,
    patterns: pattern_seqs = []
  } = await props.params;
  const {
    station_id
  } = await props.searchParams;


  let dateclass = new Date(dateparam);
  if (isNaN(dateclass.getDate())) dateclass = new Date(Date.now());
  // console.log(Date.now())
  const str = new Intl.DateTimeFormat('ja-JP', {
    calendar: 'gregory',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: undefined,
    minute: undefined,
    second: undefined,
    timeZone: 'Asia/Tokyo'
  }).format(dateclass);
  const date = str.replaceAll('/', '-');
  console.log(`Date: ${date}`);

  const PSs = new PS(pattern_seqs, date);

  return (
    <ul>
      <li>
        パターン別時刻表
      </li>
      <li className={styles.timetableNav}>
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
    <details open>
      <summary>凡例</summary>
      <ul>
        {r.map((pattern, i) => (
          <li key={i}>
            <p className={styles.timetableNavIcon}>{props.PSs.getAB(pattern.pattern_id, pattern.stop_sequence)}</p>
            <h3><span>{pattern.route_name}</span>{pattern.stop_headsign}</h3>
            <p className={styles.timetableNavFirststopname}>{pattern.first_stop_name}<span>発</span></p>
            <p className={styles.timetableNavStopname}>{pattern.stop_name}<span>の時刻</span></p>
            {/* <input type="color" value={props.PSs.getColor(pattern.pattern_id, pattern.stop_sequence) || '#000000'} onChange={} /> */}
          </li>
        ))}
      </ul>
    </details>
  )
};

async function PatternTimeTable(props: { PSs: PS }) {
  // console.log(props.PSs.date)
  const res = await patternTimesRequester.get({
    date: props.PSs.date,
    pattern_ids: props.PSs.pattern_ids,
    stop_sequences: props.PSs.stop_sequences
  });

  if (!res) return <div>No data found.</div>;

  return (
    <dl className={styles.timetable}>
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
        <Link
          href=''
          // href={`/busstop/bustime/${props.stoptime.trip_id}`}
        >
          {time.m}
          <span>{props.PSs.getAB(props.stoptime.pattern_id, props.stoptime.stop_sequence)}</span>
        </Link>
        
      </dd>
    </>
  );
};