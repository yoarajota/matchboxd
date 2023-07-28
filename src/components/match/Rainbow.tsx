import { motion } from "framer-motion";
import styles from "./page.module.css";

export const Rainbow = () => {
  return (
    <motion.div
      initial={{ x: "-120vh" }}
      animate={{ x: ["-120vh", "0vh"] }}
      transition={{ duration: 5, repeat: Infinity, type: "linear" }}
      className={styles["rainbow-animation-wrap"]}
    >
      <div className={styles["rainbow-animation-part"]} />
      <div className={styles["rainbow-animation-part"]} />
      <div className={styles["rainbow-animation-part"]} />
      <div className={styles["rainbow-animation-part"]} />
    </motion.div>
  );
};
