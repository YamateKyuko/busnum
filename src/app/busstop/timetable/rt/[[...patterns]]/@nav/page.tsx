import { TimetableNav } from "../../../[date]/[[...patterns]]/@nav/page";

export default async function Page(props: PageProps<'/busstop/timetable/[date]/[[...patterns]]'>) {
  const {
    date: dateparam,
    patterns: pattern_seqs = []
  } = await props.params;
  return (
    <>
      <TimetableNav
        dateparam={dateparam}
        pattern_seqs={pattern_seqs}
      />
    </>
  );
};