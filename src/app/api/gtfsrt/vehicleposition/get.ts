// import axios from 'axios';
import * as gtfsRealtime from '../gtfs_realtime_pb';
import feedList from '@/app/api/common/feedList';
import gtfsrtGetter from '../gtfsrtGetter';
import { vehicleObj } from './route';

export async function getRT(
  feedObj: typeof feedList[keyof typeof feedList]
): Promise<Map<string, vehicleObj[]> | null> {
  try {
    if (!feedObj.endpoints.VehiclePosition) return null;
    // 共通GTFSRT取得関数でfetch
    const gtfsrt = await gtfsrtGetter(
      feedObj.endpoints.VehiclePosition,
      { 
        "acl:consumerKey": true,
        date: feedObj.date
      }
    );
    

    if (!gtfsrt) return null;
    const descKey = feedObj.vehicleNumPropKey;
    const feedId = feedObj.feed_id;

    // const vehiclePositionData = new Map<string, vehicleObj>();
    const hoge = gtfsrt.entityList.map(
      (entity, i) => {
        const converted = convEntity(feedId, entity, i, descKey);
        if (!converted) return [];
        // const key = converted[descKey];
        // if (!key) return [];
        return converted;
        // vehiclePositionData.set(key, en);
      }
    ).flat();

    if (feedObj.vehicleNumObj == true) {
      return Map.groupBy(
        hoge,
        ({ description }) => description || ''
      );
    }

    // 指定の文字数でsliceしたものでグループ化
    const sliceIndex = feedObj.vehicleNumObj?.vehicleNumSliceIndex;
    if (!sliceIndex) return null;

    const grouped = Map.groupBy(
      hoge,
      ({ description }) => sliceIndex.map((n) => description?.charAt(n-1)).join('') || ''
    );

    return grouped;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** vehiclePositionオブジェクト正規化 */
function convEntity(
  feedId: number,
  entity: gtfsRealtime.FeedEntity.AsObject,
  entity_index: number,
  descKey: typeof feedList[keyof typeof feedList]['vehicleNumPropKey']
): vehicleObj | null { // 空配列をreturnしてflat()で削除
  const getCoo = (entity: gtfsRealtime.Position.AsObject | undefined): [number, number] | null => {
    if (!entity) return null;
    if (!entity.latitude || !entity.longitude) return null;
    return [entity.longitude, entity.latitude];
  }
  const conv = <T>(val: T) => val == undefined ? null : val;
  if (
    entity.id == undefined ||
    entity.vehicle?.trip?.tripId == undefined
  ) return null;
  const obj = {
    id: entity.id,
    isDeleted: conv(entity.isDeleted),
    feed_id: feedId,
    trip_id: entity.vehicle?.trip?.tripId,
    schedule_relationship: conv(entity.vehicle?.trip?.scheduleRelationship),
    vehicle_id: conv(entity.vehicle?.vehicle?.id),
    vehicle_label: conv(entity.vehicle?.vehicle?.label),
    wheelchair_accessible: conv(entity.vehicle?.vehicle?.wheelchairAccessible),
    coordinates: getCoo(entity.vehicle?.position) || null,
    bearing: conv(entity.vehicle?.position?.bearing),
    speed: conv(entity.vehicle?.position?.speed),
    stop_sequence: conv(entity.vehicle?.currentStopSequence),
    stop_id: conv(entity.vehicle?.stopId),
    status: conv(entity.vehicle?.currentStatus),
    timestamp: conv(entity.vehicle?.timestamp),

    entity_id: `${entity.id}_${entity_index}`,
  };

  const description = obj[descKey];

  if (description == null) return null;

  const res = {
    ...obj,
    description: description
  }

  return res;
};

