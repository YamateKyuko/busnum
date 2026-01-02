// 各種関数用ファイル。あんまり使っていない。

/** 秒数を時刻に変換 */
// export const secondToHHMMString = (second: number) => {
//   return `${Math.floor(second / 3600).toString().padStart(2, "0")}:${Math.floor((second % 3600) / 60).toString().padStart(2, "0")}`;
// };

export class Time {
  time: number;
  h: number;
  m: number;
  s: number;
  private constructor(time: number) {
    this.time = time;
    this.h = Math.floor(time / 3600);
    this.m = Math.floor((time % 3600) / 60);
    this.s = time % 60;
  };

  static set<T extends number | null | undefined>(time: T): typeof time extends number ? Time : null {
    if (time == null || time == undefined) return null as any;
    return new Time(time) as any;
  }

  hms(): string {
    return `${String(this.h).padStart(2, '0')}:${String(this.m).padStart(2, '0')}:${String(this.s).padStart(2, '0')}`;
  }

  hm(): string {
    return `${String(this.h).padStart(2, '0')}:${String(this.m).padStart(2, '0')}`;
  }
};