export default function Layout(props: LayoutProps<'/busstop/timetable/[date]/[[...patterns]]'>) {
  return (
    <ul>
      {props.station}
      {props.nav}
      {props.table}
      {/* {} */}
    </ul>
  );
};