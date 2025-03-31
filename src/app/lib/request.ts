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
export default class APIrequeste<T extends resDefObj> {
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



type resType = Record<string, unknown>;

export class APIrequester<T extends resType | resType[]> {
  root: string = '';
  endpoint: string;
  private apiKey: string = '';

  constructor(
    endpoint: string,
    root: 'rt' | 'db'
  ) {
    this.endpoint = endpoint;
    switch (root) {
      case 'rt':
        this.root = process.env.VERCEL_URL || '';
        this.apiKey = process.env.API_KEY || '';
        break;
      case 'db':
        this.root = 'https://gtfsdb.yamakyu.workers.dev'; // kari
        this.apiKey = process.env.GTFSDB_API_KEY || '';
        break;
      default:
        this.root = '';
        break;
    };
  };

  async get(requestObj: {[key: string]: string | number | string[]}): Promise<T | null> {
    try {
      const payload = {
        endpoint: this.endpoint,
        requestObj: requestObj
      };
      const token = jwt.sign(payload, this.apiKey);

      const response = await fetch(
        `${this.root}/api/${this.endpoint}`,
        {headers: {'Authorization': `Bearer ${token}`}}
      );
      const json = await response.json();
      if (!json) return null;
      return json;
    } catch(e) {
      console.log(e);
      return null;
    }
  };
};