import * as gtfsRealtime from '@/app/api/gtfsrt/gtfs_realtime_pb';
import feedList from '@/app/api/common/feedList';
import { tripObj, tripStopObj } from './route';
import gtfsrtGetter from '@/app/api/gtfsrt/gtfsrtGetter';

export async function getRT(
  feedObj: typeof feedList[keyof typeof feedList]
): Promise<Map<string, tripObj[]> | null> {
  try {
    if (!feedObj.endpoints.TripUpdates) return null;
    // 共通GTFSRT取得関数でfetch
    const gtfsrt = await gtfsrtGetter(
      feedObj.endpoints.TripUpdates,
      { 
        "acl:consumerKey": true,
        date: feedObj.date
      }
    );

    if (!gtfsrt) return null;
    const feedId = feedObj.feed_id;

    // const vehiclePositionData = new Map<string, vehicleObj>();
    const hoge = gtfsrt.entityList.map(
      (entity) => {
        const converted = convEntity(feedId, entity);
        if (!converted) return [];
        return converted;
      }
    ).flat();

    // trip_idでグループ化
    const grouped = Map.groupBy(
      hoge,
      ({ trip_id }) => trip_id
    );

    return grouped;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function convEntity(
  feedId: number,
  entity: gtfsRealtime.FeedEntity.AsObject
): tripObj | [] {

  const conv = <T>(val: T) => val == undefined ? null : val;
  if (
    entity.tripUpdate?.trip?.tripId == undefined
  ) return [];

  const obj = entity.tripUpdate?.stopTimeUpdateList.map((stopTimeUpdate) => {
    return convList(stopTimeUpdate);
  }).flat().sort((a, b) => a.stop_sequence - b.stop_sequence);

  const res = {
    feed_id: feedId,
    id: conv(entity.id),
    isDeleted: conv(entity.isDeleted),

    trip_id: entity.tripUpdate?.trip?.tripId,
    schedule_relationship: conv(entity.tripUpdate?.trip?.scheduleRelationship),

    vehicle_id: conv(entity.tripUpdate?.vehicle?.id),
    vehicle_label: conv(entity.tripUpdate?.vehicle?.label),
    wheelchair_accessible: conv(entity.tripUpdate?.vehicle?.wheelchairAccessible),

    stop_time_update_list: obj,

    timestamp: conv(entity.tripUpdate?.timestamp),
    delay: conv(entity.tripUpdate?.delay),
  };
  return res;
};

function convList(
  entity: gtfsRealtime.TripUpdate.StopTimeUpdate.AsObject
): tripStopObj | [] {
  const conv = <T>(val: T) => val == undefined ? null : val;
  if (
    entity.stopSequence == undefined
  ) return [];
  const res = {
    stop_sequence: entity.stopSequence,
    stop_id: conv(entity.stopId),

    arrival_delay: conv(entity.arrival?.delay),
    arrival_uncertainly: conv(entity.arrival?.uncertainty),

    departure_delay: conv(entity.departure?.delay),
    departure_uncertainly: conv(entity.departure?.uncertainty),

    schedule_relationship: conv(entity.scheduleRelationship),
  };
  return res;
}
