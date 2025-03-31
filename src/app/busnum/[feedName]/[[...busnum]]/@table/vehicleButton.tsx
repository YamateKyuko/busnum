'use client';

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useParams } from 'next/navigation';

export default function Button(props: {
  val: string,
  paramName: string,
  elm: React.ReactNode
}) {
  const searchParams = useSearchParams();
  const p = useParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const setParam = () => {
    const params = new URLSearchParams(searchParams);
    const param = p[props.paramName];
    const pathArr = pathname.split('/');
    if (param && param == props.val) return;
    if (param) pathArr.pop();
    replace(`${pathArr.join('/')}/${props.val}?${params.toString()}`);
  };

  return (
    <summary onClick={() => setParam()}>
      {props.elm}
    </summary>
  );
};