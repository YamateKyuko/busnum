



export default async function Page(props: PageProps<'/busstop/route/[route_id]'>) {
  const {
    route_id
  } = await props.params;
  return (
    <>
      Route ID Page {route_id}
    </>
  )
};