import APIrequester from "@/app/lib/request";

const tripRequester = new APIrequester({
  endpoint: 'gtfsdb/stop_times',
  resDef: [{
    feed_id: 'number',
    trip_id: 'string',
    stop_id: 'string',
    stop_sequence: 'number',
    arrival_time: 'string',
    departure_time: 'string',
    stop_name: 'string'
  }]
});

const tripUpdatesRequester = new APIrequester({
  endpoint: 'gtfsrt/tripUpdates',
  resDef: [{
    stop_time_update_list: 'number'
    // id: 'string',
    // feed_id: 'number',
    // trip_id: 'string',
    // schedule_relationship: 'number',
    // vehicle_id: 'string',
    // vehicle_label: 'string',
    // wheelchair_accessible: 'number',
    // stop_time_update_list: 'object',
    // timestamp: 'number',
    // delay: 'number'
  }]
});

export default async function Vehicle(props: {
  vehicle: {feed_id: number, trip_id: string, description: string, stop_id: string, stop_sequence: number}
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

  const TU = TUres?.[0] || null;
  console.log(props.vehicle);
  return (
    <li>
      <h3>{props.vehicle.description}</h3>
      <ul>
        {res.map((stop, i) => 
          <li key={stop.stop_sequence + '_' + i}>
            {
              props.vehicle.stop_id == stop.stop_id && 
              props.vehicle.stop_sequence == stop.stop_sequence &&
              <p>ここ</p>
            }
            {TU && (TU.stop_time_update_list as unknown as {[key: string]: string}[]).map((TU, i) =>
              TU.stop_id == stop.stop_id &&
              <p key={i}>遅れ: {TU.departure_delay}</p>
            )}
            <p>{stop.stop_name}</p>{stop.arrival_time as string}
          </li>
        )}
    </ul>
    </li>
  );
};