// import { API } from "@/app/api/common/api";
// import db from "@/app/api/gtfsdb/db";
// import { NextResponse } from "next/server";

import { NextResponse } from "next/server";

// const routesAPI = new API({
//   endpoint: 'gtfsdb/stop_patterns',
//   reqObjDef: {
//     feed_id: 'number',
//     trip_id: ['string'],
//     stop_id: ['string'],
//   },

//   async getProcesor(reqObj) {
//     const {
//       feed_id: feedId,
//       trip_id: tripIds,
//       stop_id: stopIds
//     } = reqObj;

//     const result = await db.run(`
//       select
//         stop_patterns.feed_id,
//         trips.trip_id,
//         stop_patterns.pattern_id,
//         stop_patterns.route_name,
//         stop_patterns.route_type,
//         stop_patterns.stop_sequence,
//         stop_patterns.stop_id,
//         stop_patterns.stop_name,
//         stop_patterns.stop_headsign,
//         stop_patterns.platform_code
//       from trips
//       inner join stop_patterns using(feed_id, pattern_id)
//       where
//         trips.feed_id = $1 and
//         (trips.trip_id, stop_patterns.stop_id) in (${tripIds.map((s, i) => `($${i + 2}, $${i + tripIds.length + 2})`).join(', ')})
      
//       `, [feedId, ...tripIds, ...stopIds]
//     );
//     if (!result) return NextResponse.json([]);
    
//     return NextResponse.json(result);
//   },
// });

export async function GET() {
  return NextResponse.json({ stop_patterns: "not implemented" });
  // return await routesAPI.get(request);
};