import { API } from "@/app/api/common/api";
import db from "@/app/api/gtfsdb/db";
import { NextResponse } from "next/server";

const routesAPI = new API({
  endpoint: 'gtfsdb/routes',
  reqObjDef: {
    feed_id: 'number',
    trip_id: ['string']
  },

  async getProcesor(reqObj) {
    const {
      feed_id: feedId,
      trip_id: tripIds
    } = reqObj;
    const result = await db.run(`
      select
        routes.feed_id,
        trips.trip_id,
        routes.route_id,
        routes.route_name,
        routes.route_type
      from trips
      inner join routes using(feed_id, route_id)
      where
        trips.feed_id = $1 and
        trips.trip_id in (${tripIds.map((s, i) => `$${i + 2}`).join(', ')});
      
      `, [feedId, ...tripIds]
    );
    if (!result) return NextResponse.json([]);
    
    return NextResponse.json(result);
  },
});

export async function GET(request: Request) {
  return await routesAPI.get(request);
};