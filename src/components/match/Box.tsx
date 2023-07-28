import Close from "@/svg/close";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { Film } from "@/types";

const Box = ({ animate, data, handleDelete, handleUsername }: any) => {
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
            tabIndex={2}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.01 }}
            className={styles["button-delete"]}
            onClick={handleDelete}
          >
            <Close />
          </motion.button>
        </div>
        <input
          tabIndex={1}
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
              href={`https://www.letterboxd.com/${film.slug}`}
              transition={{ delay: index * 0.1 }}
            >
              {film.alt}
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Box;