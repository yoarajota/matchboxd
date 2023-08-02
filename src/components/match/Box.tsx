import Close from "@/svg/close";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { Film } from "@/types";
import Clipboard from "@/svg/clipboard";
import { useCallback } from "react";
import { mountStringToCopy } from "@/helpers/frontend/index";

const Box = ({ data, handleDelete, handleUsername }: any) => {
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(mountStringToCopy(data.watchList))
  }, [data.watchList])

  return (
    <motion.div
      transition={{ duration: 0.1, type: "tween", ease: "easeOut" }}
      exit={{ scale: [1, 0] }}
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1] }}
      className={styles.box}
    >
      <div className={styles["input-container"]}>
        <div className={styles["button-delete-wrap"]}>
          <motion.button
            title="Delete user"
            // tabIndex={1}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.01 }}
            className={styles["button-delete"]}
            onClick={handleDelete}
          >
            <Close />
          </motion.button>
        </div>
        <input
          // tabIndex={0}
          value={data?.username}
          onChange={({ target: { value } }) => handleUsername(value)}
          type="text"
          className={styles.input}
          placeholder="Letterboxd username"
        />
      </div>
      <div className={styles["watchlist"]}>
        {data?.watchList.map((film: Film, index: number) => {
          return (
            <motion.a
              target="_blank"
              initial={index < 20 ? { opacity: 0, x: "-8px", scale: 1 } : {}}
              whileHover={{ scale: 1.01 }}
              animate={
                index < 20 ? { x: ["-8px", "0px"], opacity: [0, 1] } : {}
              }
              key={film.slug}
              href={`https://www.letterboxd.com${film.slug}`}
              transition={{ delay: index * 0.1 }}
            >
              {film.alt}
            </motion.a>
          );
        })}
      </div>
      {data?.watchList.length > 0 &&
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

export default Box;