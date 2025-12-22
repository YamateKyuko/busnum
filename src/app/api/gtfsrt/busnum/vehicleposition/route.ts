import { API } from "@/app/api/common/api";
import { NextResponse } from "next/server";
import feedList from "@/app/api/common/feedList";
import { getRT } from "./get";

export interface vehicleObj {
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

  // position
  coordinates: [number, number] | null,
  bearing: number | null,
  speed: number | null,

  stop_sequence: number | null,
  stop_id: string | null,
  status: 0 | 1 | 2 | null,
  timestamp: number | null,

  description: string | null,
};

type feedData = {
  lastFetchTime: number,
  cache: Map<string, vehicleObj[]> | null, // 年別固有番号ごとに区分
  props: {
    name: string,
    textColor: string,
  }
};

/** データストアクラス */
class vehiclePositionDataStore {
  data: Record<string, feedData>;
  constructor() {
    this.data = {};
    Object.entries(feedList).forEach(([key, val]) => {
      if (val.vehicleNumObj) this.data[key] = {
        lastFetchTime: 0,
        cache: null,
        props: {name: '', textColor: ''}
      };
    });
  };
  getAll(feedName: string) {
    return this.data[feedName] || null;
  };
  get(feedName: string, busNum: string) {
    const vehicleNumObj = feedList[feedName]?.vehicleNumObj;
    if (!vehicleNumObj) return null;

    const cache = this.data[feedName]?.cache;
    if (!cache) return null;
    if (vehicleNumObj === true) return cache.get(busNum) || null;

    const form = vehicleNumObj.vehicleNumAvailableFormat.find((f) => f.length == busNum.length);
    const descForm = vehicleNumObj.vehicleNumFormat;
    if (!form) return null;
    const IDX = vehicleNumObj.vehicleNumSliceIndex.map((i) => busNum.charAt(form.indexOf(i))).join(''); // バス検索インデックス

    const vehicleData = cache.get(IDX);
    if (!vehicleData) return null;

    // 一致バス番号の検索部(要調整)
    const res = vehicleData.filter(
      (vehicle) => {
        let bool = true;
        for (const [i, s] of form.entries()) {
          if (vehicle.description?.charAt(descForm.indexOf(s)) != busNum.charAt(i)) bool = false;
          // return true;
        };
        return bool;
      }
    );

    return res;
  };
  set(feedName: string, data: feedData) {
    this.data[feedName] = data;
  };
};

const store = new vehiclePositionDataStore();

const duration = 15 * 1000;

const vehiclePositionAPI = new API({
  endpoint: 'gtfsrt/busnum/vehicleposition',

  reqObjDef: {
    feedName: 'string', // e.g. 'keiobus'
    busNum: 'string',
  },

  /** vehiclePosition API定義 */
  async getProcesor(reqObj): Promise<NextResponse> {
    const currentTime = Date.now();
    
    // リクエストパラメータの取得
    const {
      feedName: feedName,
      busNum: busNum
    } = reqObj;

    // フィード管理オブジェクトを取得
    const feedObj = feedList[feedName];
    if (!feedObj) return NextResponse.json({VehiclePosition: "feedName is wrong"}, { status: 400 });
    if (!feedObj.vehicleNumObj) return NextResponse.json({VehiclePosition: "feedName is not available"}, { status: 400 });

    // console.log('vehiclePositionAPI');
    // console.log(store.getAll(feedName)); // デバッグ用
  
    // キャッシュ時間内かつキャッシュがあるときはキャッシュを返す
    const lastFetchTime = store.getAll(feedName)?.lastFetchTime;
    if (
      lastFetchTime &&
      (currentTime - lastFetchTime < duration)
    ) {
      return NextResponse.json(store.get(feedName, busNum) || []);
    };

    try {
      const response = await getRT(feedObj);
      if (!response) return NextResponse.json({VehiclePosition: "failed to fetch"}, { status: 500 });
      
      store.set(
        feedName, {
          lastFetchTime: currentTime,
          cache: response,
          props: {name: feedObj.name, textColor: feedObj.textColor}
        }
      );
      // const vehicleData = response.get(busNum);
      // if (!vehicleData) return NextResponse.json([]);
      return NextResponse.json(store.get(feedName, busNum) || []);
    } catch (e) {
      console.log(e);
      return NextResponse.json({VehiclePosition: "error"}, { status: 500 });
    }
  },
});

export async function GET(request: Request) {
  return await vehiclePositionAPI.get(request);
};

