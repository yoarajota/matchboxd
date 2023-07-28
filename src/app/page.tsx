import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles["grid-options"]}>
        <Link href="/match">
          <h3>Match</h3>
          <h3>📋</h3>
          <p>Match your watchlist or films with anyone else!</p>
        </Link>
      </div>
    </main>
  );
}
