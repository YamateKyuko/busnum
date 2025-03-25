import { fetchRequester } from "../common/api";
import gtfsRealtime from "./gtfs_realtime_pb";

export default async function gtfsrtGetter(
  endpoint: string,
  paramObj: {[key: string]: string | true}
) {
  if (!endpoint) return null;
  const response = await fetchRequester(
    endpoint,
    paramObj
  );
  if (!response) return null;
  const buffer = await response.arrayBuffer();
  const message = gtfsRealtime.FeedMessage.deserializeBinary(new Uint8Array(buffer));
  const object = message.toObject();


  return object;
};