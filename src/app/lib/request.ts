import jwt from 'jsonwebtoken';

type resDefObj = Record<string, resDefObjVals> | [Record<string, resDefObjVals>];
type resObj<T extends resDefObj> = 
T extends  [Record<string, resDefObjVals>] 
  ? {[K in keyof T[0]]: resDefObjTypeConv<T[0][K]>}[] :
T extends Record<string, resDefObjVals>
  ? {[K in keyof T]: resDefObjTypeConv<T[K]>} : unknown;
type resDefObjTypeConv<T extends resDefObjVals> = T extends 'string' ? string : number;
type resDefObjVals = 'string' | 'number';

/** 中間APIリクエスト関数の共通class */
export default class APIrequester<T extends resDefObj> {
  endpoint: string;

  resDefObj: T;

  constructor(obj: {
    endpoint: string,
    resDef: T
  }) {
    this.endpoint = obj.endpoint;
    this.resDefObj = obj.resDef;
  };

  async get(requestObj: {[key: string]: string | number | string[]}): Promise<resObj<T> | null> {
    try {
      const payload = {
        endpoint: this.endpoint,
        requestObj: requestObj
      };
      const secret = process.env.API_KEY || '';
      const token = jwt.sign(payload, secret);

      const response = await fetch(
        `${process.env.VERCEL_URL}/api/${this.endpoint}`,
        {headers: {'Authorization': `Bearer ${token}`}}
      );
      const json = await response.json();
      return json;
    } catch(e) {
      console.log(e);
      return null;
    }
  };
};



// type resType = Record<string, string | number>;

// export class APIrequeste<T extends resType> {
//   endpoint: string;

//   // resDefObj: T;

//   constructor(obj: {
//     endpoint: string,
//     // resDef: T
//   }) {
//     this.endpoint = obj.endpoint;
//     // this.resDefObj = obj.resDef;
//   };

//   async get(requestObj: {[key: string]: string | number | string[]}): Promise<T | null> {
//     try {
//       const payload = {
//         endpoint: this.endpoint,
//         requestObj: requestObj
//       };
//       const secret = process.env.API_KEY || '';
//       const token = jwt.sign(payload, secret);

//       const response = await fetch(
//         `${process.env.VERCEL_URL}/api/${this.endpoint}`,
//         {headers: {'Authorization': `Bearer ${token}`}}
//       );
//       const json = await response.json();
//       return json;
//     } catch(e) {
//       console.log(e);
//       return null;
//     }
//   };
// };

// type piyo = {
//   route_name: string,
// }

// const api = new APIrequeste<piyo>({
//   endpoint: 'gtfsdb/routes',
// });

// const hoge = await api.get({
//   feed_id: 1,
//   trip_id: 'a'
// });

// console.log(hoge && hoge.route_name)