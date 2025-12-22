import { NextResponse } from "next/server";
import { getRT } from "../get";
import feedList from "@/app/api/common/feedList";
import { API } from "@/app/api/common/api";
// import { tripObj, tripStopObj } from "../route";
import { store } from "../route";

const duration = 15 * 1000;

const tripUpdatesTripsAPI = new API({
  endpoint: 'gtfsrt/busnum/tripUpdates/trips',

  reqObjDef: {
    feed_id: 'number', // e.g. 'keiobus'
    trip_ids: 'string[]'
  },

  /** vehiclePosition API定義 */
  async getProcesor(reqObj): Promise<NextResponse> {
    const currentTime = Date.now();
    
    // リクエストパラメータの取得
    const {
      feed_id: feedId,
      trip_ids: tripIds
    } = reqObj;

    // フィード管理オブジェクトを取得
    const [feedName, feedObj] = Object.entries(feedList).find(([, f]) => f.feed_id == feedId) || [];
    if (!feedName) return NextResponse.json({TripUpdates: "feed_id is wrong"}, { status: 400 });
    if (!feedObj) return NextResponse.json({TripUpdates: "feedName is wrong"}, { status: 400 });
    if (!feedObj.tripUpdatesObj) return NextResponse.json({TripUpdates: "feedName is not available"}, { status:400 });

    // console.log('tripUpdatesAPI');
    // console.log(store.getAll(feedName)); // デバッグ用
  
    // キャッシュ時間内かつキャッシュがあるときはキャッシュを返す
    const lastFetchTime = store.getAll(feedName)?.lastFetchTime;
    if (
      lastFetchTime &&
      (currentTime - lastFetchTime < duration)
    ) {
      return NextResponse.json(store.getByIDs(feedName, tripIds) || []);
    };

    try {
      const response = await getRT(feedObj);
      if (!response) return NextResponse.json({TripUpdates: "failed to fetch"}, { status: 500 });
      
      store.set(
        feedName, {
          lastFetchTime: currentTime,
          cache: response,
          props: {name: feedObj.name, textColor: feedObj.textColor}
        }
      );
      // const vehicleData = response.get(busNum);
      // if (!vehicleData) return NextResponse.json([]);
      return NextResponse.json(store.getByIDs(feedName, tripIds) || []);
      // return NextResponse.json({});
    } catch (e) {
      console.log(e);
      return NextResponse.json({VehiclePosition: "error"}, { status: 500 });
    }
  },
});

export async function GET(request: Request) {
  return await tripUpdatesTripsAPI.get(request);
};