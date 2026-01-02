import { APIrequester } from '@/app/lib/request';
import { PS } from '../../../PS';
import styles from './nav.module.css';

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

const patternRequester = new APIrequester<pattern[], pattern_request>(
  'gtfsdb/patterns', 'db'
);

export default async function Page(props: PageProps<'/busstop/timetable/[date]/[[...patterns]]'>) {
  const {
    date: dateparam,
    patterns: pattern_seqs = []
  } = await props.params;
  return (
    <>
      <TimetableNav
        dateparam={dateparam}
        pattern_seqs={pattern_seqs}
      />
    </>
  );
};

export async function TimetableNav(props: { dateparam: string, pattern_seqs: string[] }) {
  let dateclass = new Date(props.dateparam);
  if (isNaN(dateclass.getDate())) dateclass = new Date(Date.now());

  const PSs = new PS(props.pattern_seqs, dateclass);

  return (
    <li className={styles.timetableNav}>
      <PatternTable
        PSs={PSs}
      />
    </li>
  );
};

async function PatternTable(props: { PSs: PS }) {
  const r = await patternRequester.get({
    pattern_ids: props.PSs.pattern_ids,
    stop_sequences: props.PSs.stop_sequences
  });
  if (!r) return <div>No data found.</div>;

  // const a = () => {
  //   'use client';
  // }

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
            {/* <input type="color" value={props.PSs.getColor(pattern.pattern_id, pattern.stop_sequence) || '#000000'} onChange={() => {console.log('hello')}} /> */}
          </li>
        ))}
      </ul>
    </details>
  )
};