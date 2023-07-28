import { motion } from "framer-motion";
import styles from "./page.module.css";
import { Film } from "@/types";
import { Rainbow } from "./Rainbow";

const Match = ({ data }: any) => {
    return (
      <motion.div
        transition={{ duration: 0.3, type: "tween", ease: "easeOut" }}
        exit={{ scale: [1, 0] }}
        initial={{ scale: 1 }}
        animate={{ scale: [0, 1] }}
        className={styles.box}
      >
        <div className={styles["match-title-wrap"]}>
          <h3 className={styles["match-title"]}>
            {data?.length !== 0 ? "Matched!" : "Nothing matched..."}
          </h3>
        </div>
        <div className={styles["watchlist"]}>
          {data?.map((film: Film, index: number) => {
            return (
              <motion.a
                target="__blank"
                initial={index < 20 ? { opacity: 0, x: "-8px", scale: 1 } : {}}
                whileHover={{ scale: 1.01 }}
                key={film.slug}
                animate={
                  index < 20 ? { x: ["-8px", "0px"], opacity: [0, 1] } : {}
                }
                href={`https://www.letterboxd.com/${film.slug}`}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                {film.alt}
              </motion.a>
            );
          })}
        </div>
        <Rainbow />
      </motion.div>
    );
  };

  export default Match;