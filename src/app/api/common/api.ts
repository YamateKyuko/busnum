import { NextResponse } from "next/server";
// import { authenticate } from "./auth";
import jwt from 'jsonwebtoken';

// export interface APIconstructor_ {
//   endpoint: string;
//   getProcesor: (obj: {[key: string]: unknown}) => Promise<NextResponse>;
// };

export interface RequestPayload<T extends object> {
  endpointName: string;
  requestObj: T;
};

export interface ResponsePayload<T extends object> {
  status: 'ok' | 'err';
  result: T;
};

const apiKey = process.env.API_KEY || null;

type reqDefObj = Record<string, reqDefObjVals | [reqDefObjVals]>;
type reqObj<T extends reqDefObj> = {[K in keyof T]: reqDefObjTypeConv<T[K]>;};
type reqDefObjTypeConv<T extends reqDefObjVals | [reqDefObjVals]> = 
T extends reqDefObjVals ? reqDefObjNonArrTypeConv<T> :
T extends [reqDefObjVals] ? reqDefObjNonArrTypeConv<T[number]>[]
: never;

type reqDefObjNonArrTypeConv<T extends reqDefObjVals> = 
T extends 'string' ? string :
T extends 'number' ? number :
T extends ['string', 'string'] ? [string, string] :
never;
type reqDefObjVals = 'string' | 'number' | ['string', 'string'];

/** API共通class */
export class API<reqObjGenerics extends reqDefObj> {
  // private endpoint: string;
  // private requestPoint: string;
  private endpoint: string;

  private reqDefObj: reqDefObj;
  getProcessor: (
    reqObj: reqObj<reqObjGenerics>
  ) => Promise<NextResponse>;
  constructor(obj: {
    endpoint: string,
    reqObjDef: reqObjGenerics,
    getProcesor: (reqObj: reqObj<reqObjGenerics>) => Promise<NextResponse>
  }) {
    this.endpoint = obj.endpoint;
    this.getProcessor = obj.getProcesor;
    this.reqDefObj = obj.reqObjDef;
    return this;
  };

  get(request: Request) {
    return this.auth(request, this.getProcessor);
  };

  auth(
    req: Request,
    func: (val: reqObj<reqObjGenerics>) => Promise<NextResponse>
  ) {
    if (!apiKey) return NextResponse.json({ error: 'api key is not avilable' }, { status: 401 });

    // ヘッダ確認
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'without authorization header' }, { status: 401 });
  
    // JWT存在確認
    const token = authHeader.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'without token' }, { status: 401 });
  
    try {
      // JWTボディ部検証
      const payload = jwt.verify(token, apiKey);
      if (!isObject(payload)) return NextResponse.json({ error: 'wrong token format' }, { status: 401 });
      if (payload.endpoint != this.endpoint) return NextResponse.json({ error: 'wrong endpoint name' }, { status: 401 });
      // リクエストパラメータ検証
      const requestObj = payload.requestObj;
      if (!isObject(requestObj)) return NextResponse.json({ error: 'wrong request parameter format' }, { status: 401 });
      // リクエストパラメータのプロパティチェック(型チェックはいいかな)
      for (const [key] of Object.entries(this.reqDefObj)) {
        if (!(key in requestObj)) return NextResponse.json({ error: `missing ${key}`}, { status: 401 });
      };
      return func(payload.requestObj as reqObj<reqObjGenerics>); // 型注意
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: 'error' }, { status: 401 });
    }
  };

  
};

type queryParam = {[key: string]: string | undefined | number | object};
const isObject = (x: unknown): x is queryParam =>
  x !== null && (typeof x === 'object' || typeof x === 'function')



export async function fetchRequester (
  url: string,
  paramObj: {
    [key: string]: string | true
  }
) {
  try {
    const params = new URLSearchParams();

    // trueのプロパティは既定値を代入
    Object.entries(paramObj).map(([key, val]) => {
      if (val == true) {
        switch (key) {
          case 'acl:consumerKey': // ACLを参照のこと
            params.append(key, process.env.ODPT_API_KEY || ''); break;
          default:
            break;
        };
        paramObj[key] = ''
      } else {params.append(key, val)};
    });

    // fetch
    const result = await fetch(
      `${url}?${params.toString()}`,
      {method: 'GET',}
    );
    return result;
  } catch(e) {
    console.log(e);
    return null;
  };
};