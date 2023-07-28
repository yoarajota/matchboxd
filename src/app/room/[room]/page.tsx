"use client";

import { socketInit } from "@/helpers/frontend/socket";
import styles from "./page.module.css";
import { useEffect } from "react";
import io from "socket.io-client";

let socket;

export default function Page({
  params: { room },
}: {
  params: { room: string };
}) {
  // useEffect(() => {
  //   function b() {
  //     socketInit(room);
  //     socket = io();
  //   }

  //   b();

  //   return () => {
  //     b;
  //   };
  // }, [room]);

  return <main className={styles.main}>My Post: {room}</main>;
}