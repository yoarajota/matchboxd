import { motion } from "framer-motion";
import styles from "./page.module.css";
import { Film } from "@/types";
import { Rainbow } from "./Rainbow";
import Clipboard from "@/svg/clipboard";
import { useCallback } from "react";
import { mountStringToCopy } from "@/helpers/frontend/index";

const Match = ({ data }: any) => {
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(mountStringToCopy(data))
  }, [data])

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
      {data?.length > 0 &&
        <motion.div animate={{ opacity: [0, 1] }} transition={{ delay: 1 }} className={styles['clipboard-wrap']}>
          <div>
            <motion.button title="Copy the list to clipboard" onClick={copy} initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Clipboard />
            </motion.button>
          </div>
        </motion.div>
      }
    </motion.div>
  );
};

export default Match;