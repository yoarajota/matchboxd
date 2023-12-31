import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import styles from "./page.module.css";
import { ToastContainer } from "react-toastify";
import LetterboxLogo from "@/svg/letterboxLogo";

const noto = Noto_Sans({
  display: "swap",
  variable: "--font-noto",
  weight: ["500", "600", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matchboxd 🎬",
  description: "Match your watchlist with anyone!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={noto.className}>
        <header>
          <div className={styles.header}>
            <div>
              <LetterboxLogo />
            </div>
            <div className={styles["logo-text-wrap"]}>
              <h1 className={styles["logo-text"]}>Matchboxd</h1>
            </div>
            <div className={styles["logo-text-wrap"]}>
              <p className={styles["logo-text"]}>
                ⎯ made by{" "}
                <strong>
                  <a href="https://yoarajota.vercel.app" target="_blank">
                    yoarajota
                  </a>
                </strong>{" "}
                ⎯
              </p>
            </div>
          </div>
        </header>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}