'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { usePathname, useSearchParams } from 'next/navigation';
import { Url } from 'next/dist/shared/lib/router/router';

export default function Page(props: PageProps<'/busnum/[feedName]/[[...busnum]]'>) {
  const path = usePathname();
  const searchParams = useSearchParams();
  
  // console.log(path);
  searchParams.forEach((value, key) => {
    // console.log(`${key}: ${value}`);
  });
  // const {
  //   [feedNameParamName]: feedName,
  //   [busNumParamName]: busNum,
  //   // [isFareDispParamName]: isFareDispParam
  // } = await props.params;

  const fareParam = (): Url => {
    const searches = new URLSearchParams(searchParams.toString());
    if (searchParams.get('fare') == 'true') {
      searches.delete('fare');
    } else {
      searches.set('fare', 'true')
    };
    return path + '?' + searches.toString();
  };

  const langParam = (v: string | null): Url => {
    const searches = new URLSearchParams(searchParams.toString());
    if (v == null) {
      searches.delete('lang');
    } else {
      searches.set('lang', v);
    };
    return path + '?' + searches.toString();
  };

  const humClass = (p: string, v: string | null): string | undefined => {
    if (v == null) {
      return searchParams.get(p) ? styles.humsel : ''
    };
    return searchParams.get(p) == v ? styles.humsel : ''
  };



  return (
    
    <details className={styles.hamburger}>
      <summary>humburger</summary>
      <div className={styles.humcontent}>
        <div>
          <Link href={fareParam()} className={humClass('fare', 'true')}>運賃 / Fare</Link>
        </div>
        <div>
          <Link href={langParam(null)} className={humClass('lang', null)}>言語 / Language</Link>
          <Link href={langParam('ja')} className={humClass('lang', 'ja')}>日本語</Link>
          <Link href={langParam('en')} className={humClass('lang', 'en')}>English</Link>
          <Link href={langParam('ja-Hrkt')} className={humClass('lang', 'ja-Hrkt')}>よみがな</Link>
        </div>
        
      </div>
    </details>
  );
};