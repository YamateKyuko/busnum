export default async function Page(props: PageProps<'/busstop/station'>) {
  const {
    name: name
  } = await props.searchParams;
  return (
    <ul>
      <li>
        検索
      </li>
    </ul>
  );
};