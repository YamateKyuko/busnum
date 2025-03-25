import { API } from "@/app/api/common/api";
import db from "@/app/api/gtfsdb/db";
import { NextResponse } from "next/server";

const routesAPI = new API({
  endpoint: 'gtfsdb/stop_times',
  reqObjDef: {
    feed_id: 'number',
    trip_id: 'string'
  },

  async getProcesor(reqObj) {
    const result = await db.run(`
      SELECT 
        feed_id,
        trip_id,
        stop_sequence,
        stop_id,
        arrival_time,
        departure_time,
        stop_headsign,
        pickup_type,
        drop_off_type,
        stop_name
      FROM stop_times
      inner join stops using (feed_id, stop_id)
      WHERE feed_id = $1 and trip_id = $2
      
      order by stop_sequence
      `,
      [reqObj.feed_id, reqObj.trip_id]
    );
    // console.log(result);
    if (!result) return NextResponse.json([]);
    
    return NextResponse.json(result);
  },
});

export async function GET(request: Request) {
  return await routesAPI.get(request);
};