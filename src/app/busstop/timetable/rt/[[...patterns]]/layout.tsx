export default async function Layout(props: LayoutProps<'/busstop/timetable/rt/[[...patterns]]'>) {
  return (
    <>
      {/* {props.search} */}
      {props.nav}
      {props.timetable}
    </>
  );
}