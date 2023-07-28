import Link from "next/link";
import styles from "./page.module.css";

const HomeButton = () => {
  return <Link className={styles['home-button']} href="/">Home</Link>;
};

export default HomeButton;
