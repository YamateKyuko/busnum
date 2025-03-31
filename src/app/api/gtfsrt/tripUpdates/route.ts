import { NextResponse } from "next/server";
import { getRT } from "./get";
import feedList from "../../common/feedList";
import { API } from "../../common/api";

export interface tripObj {
  id: string | null,
  isDeleted: boolean | null,
  
  // trip
  feed_id: number,
  trip_id: string,
  schedule_relationship: 0 | 1 | 2 | 3 | 5 | 6 | 7 | null,

  // vehicle
  vehicle_id: string | null,
  vehicle_label: string | null,
  wheelchair_accessible: 0 | 1 | 2 | 3 | null,

  // list
  stop_time_update_list: tripStopObj[],

  timestamp: number | null,
  delay: number | null,
};

export interface tripStopObj {
  stop_sequence: number,
  stop_id: string | null,
  arrival_delay: number | null,
  arrival_uncertainly: number | null,
  departure_delay: number | null,
  departure_uncertainly: number | null,
  schedule_relationship: 0 | 1 | 2 | 3 | 5 | 6 | 7 | null,
};

type feedData = {
  lastFetchTime: number,
  cache: Map<string, tripObj[]> | null, // trip_idで区分
  props: {
    name: string,
    textColor: string,
  }
};

/** データストアクラス */
class tripUpdatesDataStore {
  data: Record<string, feedData>;
  constructor() {
    this.data = {};
    Object.entries(feedList).forEach(([key, val]) => {
      if (val.tripUpdatesObj) this.data[key] = {
        lastFetchTime: 0,
        cache: null,
        props: {name: '', textColor: ''}
      };
    });
  };
  getAll(feedName: string) {
    return this.data[feedName] || null;
  };
  get(feedName: string, tripId: string) {
    // const vehicleNumObj = feedList[feedName]?.vehicleNumObj;
    // if (!vehicleNumObj) return null;
    // const form = vehicleNumObj.vehicleNumAvailableFormat.find((f) => f.length == busNum.length);
    // const descForm = vehicleNumObj.vehicleNumFormat;
    // if (!form) return null;
    // const IDX = vehicleNumObj.vehicleNumSliceIndex.map((i) => busNum.charAt(form.indexOf(i))).join(''); // バス検索インデックス
    const cache = this.data[feedName]?.cache;
    if (!cache) return null;
    const vehicleData = cache.get(tripId);
    if (!vehicleData) return null;

    // 一致バス番号の検索部(要調整)
    // const res = vehicleData.filter(
    //   (vehicle) => {
    //     for (const [i, s] of form.entries()) {
    //       if (vehicle.description?.charAt(descForm.indexOf(s)) != busNum.charAt(i)) return false;
    //       return true;
    //     };
    //   }
    // );

    return vehicleData;
  };
  set(feedName: string, data: feedData) {
    this.data[feedName] = data;
  };
};

const store = new tripUpdatesDataStore();

const duration = 15 * 1000;

const tripUpdatesAPI = new API({
  endpoint: 'gtfsrt/tripUpdates',

  reqObjDef: {
    feed_id: 'number', // e.g. 'keiobus'
    trip_id: 'string'
  },

  /** vehiclePosition API定義 */
  async getProcesor(reqObj): Promise<NextResponse> {
    const currentTime = Date.now();
    
    // リクエストパラメータの取得
    const {
      feed_id: feedId,
      trip_id: tripId
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
      return NextResponse.json(store.get(feedName, tripId) || []);
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
      return NextResponse.json(store.get(feedName, tripId) || []);
    } catch (e) {
      console.log(e);
      return NextResponse.json({VehiclePosition: "error"}, { status: 500 });
    }
  },
});

export async function GET(request: Request) {
  return await tripUpdatesAPI.get(request);
};