export type feedListObj_ = {
  name: string,
  date: string,
  feed_id: number,
  endpoints: {
    VehiclePosition?: string,
    TripUpdates?: string,
    GTFS: string
  },
  params: string[],
  textColor: string,
  vehicleNumPropKey: 'vehicle_label' | 'vehicle_id',
  vehicleNumObj?: {
    vehicleNumFormat: number[],
    vehicleNumSliceIndex: number[],
    vehicleNumAvailableFormat: (number)[][]
    // {
    //   [key: number]: { // 文字長
    //     form: (number)[], // vehicleNumFormatのインデックス
    //     idx: number[] // vehicleNumSliceIndexの検索文字列内の位置
    //   }
    // }
  } | true,
  tripUpdatesObj?: {
    a?: string
  }
};

/** GTFS管理用定数オブジェクト */
const feedList: Record<string, feedListObj_> = {
  'keiobus': {
    name: '京王バス',
    date: 'current',
    feed_id: 1,
    endpoints: {
      VehiclePosition: 'https://api.odpt.org/api/v4/gtfs/realtime/odpt_KeioBus_AllLines_vehicle',
      TripUpdates: 'https://api.odpt.org/api/v4/gtfs/realtime/odpt_KeioBus_AllLines_trip_update',
      GTFS: 'https://api.odpt.org/api/v4/gtfs/odpt_KeioBus_AllLines'
    },
    params: ['acl:consumerKey', 'date'],
    textColor: '#092c70',
    vehicleNumPropKey: 'vehicle_label',
    vehicleNumObj: {
      vehicleNumFormat: [1,2,3,4,5], // MYYNN
      vehicleNumSliceIndex: [3,4,5], // 京王バスは13年までは車番はメーカ、年度別にふっていた模様。以降は年度別。
      vehicleNumAvailableFormat: [[3,4,5],[6,3,4,5],[1,2,3,4,5],[6,1,2,3,4,5]] // YYNNN, MYYNNN, MYYNNNN
    },
    tripUpdatesObj: {}
  },
  'toeibus': {
    name: '都営バス',
    date: 'current',
    feed_id: 2,
    endpoints: {
      VehiclePosition: 'https://api.odpt.org/api/v4/gtfs/realtime/ToeiBus',
      // TripUpdates 未提供
      GTFS: 'https://api-public.odpt.org/api/v4/files/Toei/data/ToeiBus-GTFS.zip'
    },
    params: ['date'],
    textColor: '#66cc33',
    vehicleNumPropKey: 'vehicle_label',
    vehicleNumObj: {
      vehicleNumFormat: [1,2,3,4],
      vehicleNumSliceIndex: [2,3,4],
      vehicleNumAvailableFormat: [[1,2,3,4], [2,3,4]]
    }
  },
  'seibubus': {
    name: '西武バス',
    feed_id: 3,
    date: 'current',
    endpoints: {
      VehiclePosition: 'https://api.odpt.org/api/v4/gtfs/realtime/SeibuBus_vehicle',
      TripUpdates: 'https://api.odpt.org/api/v4/gtfs/realtime/SeibuBus_trip_update',
      GTFS: 'https://api.odpt.org/api/v4/files/SeibuBus/data/SeibuBus-GTFS.zip'
    },
    params: ['acl:consumerKey'],
    textColor: '#a80043',
    vehicleNumPropKey: 'vehicle_id',
    vehicleNumObj: true,
    tripUpdatesObj: {}
  }
  // 'kantobus': {
  //   name: '関東バス',
  //   feed_id: 4,
  //   date: 'current',
  //   endpoints: {
  //     VehiclePosition: 'https://api.odpt.org/api/v4/gtfs/realtime/odpt_KantoBus_AllLines_vehicle',
  //     TripUpdates: 'https://api.odpt.org/api/v4/gtfs/realtime/odpt_KantoBus_AllLines_trip_update',
  //     GTFS: 'https://api.odpt.org/api/v4/gtfs/odpt_KantoBus_AllLines'
  //   },
  //   params: ['acl:consumerKey', 'date'],
  //   textColor: '#a80043',
  //   vehicleNumPropKey: 'vehicle_id'
  // }
} as const;

export type feedListNames = ['keiobus', 'toeibus', 'kantobus'];
export type vehiclePositionProvideFeedNames = ['keiobus', 'toeibus', 'kantobus'];
export type tripUpdatesProvideFeedNames = ['keiobus', 'kantobus'];

export default feedList;