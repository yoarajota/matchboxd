"use client";

import styles from "./page.module.css";

export default function Page({
  params: { room },
}: {
  params: { room: string };
}) {

  return <main className={styles.main}>My Post: {room}</main>;
}