// import Image from "next/image";
// import busnum3logo from "/busnum3logo.svg";
// import styles from "./page.module.css";
import Search from "./searchBox"; 

export const busNumSearchParamName = 'busnum';

export default function Page() {
  return (
    <>
      <Search
        placeholder="車番を入力"
        paramName="busnum"
      />
    </>
  );
};
