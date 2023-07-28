import { motion } from "framer-motion";
import styles from "./page.module.css";

const Loading = () => {
  return (
    <motion.div
      className={styles.loading}
      animate={{
        rotate: 360,
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        },
      }}
    />
  );
};

export default Loading;
