type pso = {
  pattern_id: number,
  stop_sequence: number,
  index: number,
  ab: string,
  color: string
};

// export class PS<T extends Date | undefined = undefined> {
export class PS {
  pattern_ids: number[] = [];
  stop_sequences: number[] = [];
  tbl: Map<`${number}_${number}`, pso> = new Map();
  // date: T extends Date ? string : undefined;
  date: string;

  // constructor(values: string[], d?: T) {
  constructor(values: string[], d: Date) {

    const str = new Intl.DateTimeFormat('ja-JP', {
      calendar: 'gregory',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: undefined,
      minute: undefined,
      second: undefined,
      timeZone: 'Asia/Tokyo'
    }).format(d);
    const date = str.replaceAll('/', '-');

    // this.date = (d instanceof Date ? date : undefined) as unknown as (T extends Date ? string : undefined);
    this.date = date;
    
    values.forEach((v, i) => {
      const [p, s] = v.split('_').map((n) => Number(n));
      if (!p || !s || isNaN(p) || isNaN(s)) return;
      this.tbl.set(`${p}_${s}`, {
        pattern_id: p,
        stop_sequence: s,
        index: i,
        ab: PS.convABC(i),
        color: 'black'
      });
      this.pattern_ids.push(p);
      this.stop_sequences.push(s);
    });
  };

  getIndex(p: number, s: number): number | null {
    const o = this.get(p, s);
    if (!o) return null;
    return o.index;
  };

  static convABC(v: number): string {
    return String.fromCharCode(...[(v > 25) ? (Math.floor(v / 26) + 64): [], (v % 26) + 65].flat());
  };

  getAB(p: number, s: number): string | null {
    const o = this.get(p, s);
    if (!o) return null;
    return o.ab;
  }

  get(p: number, s: number): pso | null {
    const o = this.tbl.get(`${p}_${s}`);
    if (!o) return null;
    return o;
  }

  // getColor(p: number, s: number): string | null {
  //   const o = this.get(p, s);
  //   if (!o) return null;
  //   return o.color;
  // }

  // setColor(p: number, s: number, c: string): void {
  //   const o = this.get(p, s);
  //   if (!o) return;
  //   o.color = c;
  // }

  // setColorHandler: ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(event)
  //   // return (e) => {
  //   //   const [p, s] = event.target.value.split('_').map((n) => Number(n));
  //   //   this.setColor(p, s, e.target.value);
  //   // };
  // }
}