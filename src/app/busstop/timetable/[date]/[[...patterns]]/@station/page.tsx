import { APIrequester } from "@/app/lib/request";
import { Suspense } from "react";
export const revalidate = 0;

export type station = {
  feed_id: number,
  station_id: number,
  station_name: string,
  station_lat: number,
  station_lon: number,
  stop_patterns: stop[]
};

export type stop = {
  feed_id: number,
  stop_id: string,
  stop_name: string,
  pattern_id: string,
  route_id: string,
  direction_id: number,
  stop_sequence: number,
  route_name: string,
  stop_headsign: string,
  platform_code: string,
  zone_id: string,
  first_stop_name: string,
  weekday_count: number,
};

type station_request = {
  station_id: number
}

const stationsRequester = new APIrequester<station, station_request>(
  'gtfsdb/stations', 'db'
);

export default async function Page(props: PageProps<'/busstop/timetable/[date]/[[...patterns]]'>) {
  const {
    station_id
  } = await props.searchParams;

  return (
    <ul>
      <Suspense fallback={<div>Loading...</div>}>
        <StationTable station_id={Number(station_id)} />
      </Suspense>
    </ul>
  );
};

async function StationTable(props: { station_id: number }) {
  const station = await stationsRequester.get({
    station_id: props.station_id
  });
  // console.log(station);
  if (!station) return <div>No data found.</div>;
  return (
    <>
      <li>
        <details>
          <summary>Station Info</summary>
          Station ID: {props.station_id}
          <h2>{station.station_name}</h2>
          {station.stop_patterns.map((stop, i) => (
            <PatternTable
              key={`${stop.pattern_id}-${stop.stop_sequence}`}
              stop={stop}
              isStopNeeded={station.stop_patterns[i - 1]?.stop_id !== stop.stop_id}
            />
          ))}
        </details>
        
      </li>

      
        {/* <ul>
          
        </ul> */}
    </>
  )
}

function PatternTable(props: {stop: stop, isStopNeeded: boolean}) {
  return (
    <>
      {props.isStopNeeded &&
        <li>
          <h4>{props.stop.stop_name} ({props.stop.platform_code})</h4>
          <div>Stop ID: {props.stop.stop_id}</div>
          
        </li>
      }
      <li>
        <h3>{props.stop.route_name}{props.stop.stop_headsign}</h3>
        {props.stop.first_stop_name}から・
        平日{props.stop.weekday_count}本運転
      </li>
    </>
  );
};