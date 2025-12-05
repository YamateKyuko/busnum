



export default async function Page(props: PageProps<'/busstop/timetable/[[...patterns]]'>) {
  const {
    patterns: pattern_seqs = []
  } = await props.params;
  const {
    station_id
  } = await props.searchParams;

  console.log(pattern_seqs);

  const pattern_ids = pattern_seqs.map((pattern_seq) => {

  });

  const stop_sequences = pattern_ids.map((pattern_seq) => {

  });


  return (
    <ul>
      <li>
        パターン別時刻表
      </li>
    </ul>
  )
};
