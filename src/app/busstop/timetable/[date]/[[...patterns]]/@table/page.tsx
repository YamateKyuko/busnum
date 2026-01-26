import { APIrequester } from "@/app/lib/request";
import { Time } from "@/app/lib/util";
import styles from './timetable.module.css';
import Link from "next/link";
import { ChangeEventHandler } from "react";
import { PS } from "../../../PS";

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

const patternTimesRequester = new APIrequester<pattern_times[], pattern_times_request>(
  'gtfsdb/pattern_times', 'db'
);

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

  const PSs = new PS(pattern_seqs, dateclass);

  return (
    <>
      <li>
        {PSs.date}
      </li>
      <li>
        <PatternTimeTable
          PSs={PSs}
        />
      </li>
    </>
  )
};



async function PatternTimeTable(props: { PSs: PS }) {
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
          // href=''
          href={`/busstop/bustime/${props.stoptime.trip_id}`}
        >
          {time.m}
          <span>{props.PSs.getAB(props.stoptime.pattern_id, props.stoptime.stop_sequence)}</span>
        </Link>
        
      </dd>
    </>
  );
};