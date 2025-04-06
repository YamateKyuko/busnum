import Link from 'next/link';

export default function Home() {
  return (
    <>
      <p>ホーム</p>
      <Link href='/busnum' >
        busnum
      </Link>
    </>
  );
};