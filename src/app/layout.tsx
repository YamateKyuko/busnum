import type { Metadata } from "next";
import "./globals.css";
// import styles from "./layout.module.css";
// import Image from "next/image";
// import Link from "next/link";

export const metadata: Metadata = {
  title: "busnum",
  description: "Bus Useful Service Navigation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};