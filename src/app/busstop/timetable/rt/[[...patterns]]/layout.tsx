export default async function Layout(props: LayoutProps<'/busstop/timetable/rt/[[...patterns]]'>) {
  return (
    <>
      {props.nav}
      {props.timetable}
    </>
  );
}