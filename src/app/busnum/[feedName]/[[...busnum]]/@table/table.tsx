import APIrequester from "@/app/lib/request";
import Vehicle from "./vehicle";
import VehicleButton from "./vehicleButton";
import { busNumParamName } from "../layout";

const vehiclePositionRequester = new APIrequester({
  endpoint: 'gtfsrt/vehicleposition',
  resDef: [{
    id: 'string',
    description: 'string',
    feed_id: 'number',
    trip_id: 'string',
    stop_id: 'string',
    schedule_relationship: 'number',
    stop_sequence: 'number',
  }]
});

const stopPatternsRequester = new APIrequester({
  endpoint: 'gtfsdb/stop_patterns',
  resDef: [{
    feed_id: 'number',
    route_id: 'string',
    trip_id: 'string',
    route_name: 'string',
    route_type: 'number'
  }]
});

export default async function Table(props: {
  feedName: string,
  busnum: string,
  selected: string | null
}) {
  const vehicles = await vehiclePositionRequester.get({
    feedName: props.feedName,
    busNum: props.busnum
  });
  if (!vehicles) return <></>;

  const tripIds = vehicles.map((vehicle) => vehicle.trip_id);

  const routes = await stopPatternsRequester.get({
    feed_id: vehicles[0]?.feed_id || 0,
    trip_id: tripIds,
    stop_id: vehicles.map((vehicle) => vehicle.stop_id)
  });
  console.log('aaaaa')
  console.log(routes);

  return (
    <>
      {vehicles.map((vehicle) =>
        props.selected === vehicle.description ? (
          <Vehicle
            key={vehicle.trip_id}
            vehicle={vehicle}
          />
        ) : (
          <VehicleButton
            key={vehicle.trip_id}
            val={vehicle.description}
            paramName={busNumParamName}
            elm={<>{vehicle.description}</>}
          />
      ))}

      {vehicles.length === 0 &&
        <li>
          ごめんなさい。ごめんなさい。<br />
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