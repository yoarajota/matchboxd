"use client";

import { useState, useCallback } from "react";
import styles from "./page.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { Film } from "../types";
import _ from "lodash";
import { toast } from "react-toastify";
import Plus from "@/svg/plus";
import axios from "axios";
import Close from "@/svg/close";

type Data = {
  username: string;
  watchList: Array<Film>;
  id: string;
  isMatch?: boolean;
};

const err = "Minimum of 2 accounts to match!";

const Rainbow = () => {
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

const Match = ({ data }: any) => {
  return (
    <motion.div
      transition={{ duration: 0.3, type: "tween", ease: "easeOut" }}
      exit={{ scale: [1, 0] }}
      initial={{ scale: 1 }}
      animate={{ scale: [0, 1] }}
      className={styles.box}
    >
      <div>
        <div className={styles["match-title-wrap"]}>
          <h2 className={styles["match-title"]}>
            {data?.length !== 0 ? "Matched!" : "Nothing matched..."}
          </h2>
        </div>
        <div className={styles["watchlist"]}>
          {data?.map((film: Film, index: number) => {
            return (
              <motion.a
                target="__blank"
                initial={{ opacity: 0, x: "-8px", scale: 1 }}
                whileHover={{ scale: 1.01 }}
                key={film.slug}
                animate={{ x: ["-8px", "0px"], opacity: [0, 1] }}
                href={`https://www.letterboxd.com/${film.slug}`}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                {film.alt}
              </motion.a>
            );
          })}
        </div>
        <Rainbow />
      </div>
    </motion.div>
  );
};

const Box = ({ animate, data, handleDelete, handleUsername }: any) => {
  return (
    <motion.div
      transition={{ duration: 0.1, type: "tween", ease: "easeOut" }}
      exit={{ scale: [1, 0] }}
      initial={{ scale: 1 }}
      animate={animate ? { scale: [0, 1] } : {}}
      className={styles.box}
    >
      <div>
        <div className={styles["input-container"]}>
          <div className={styles["button-delete-wrap"]}>
            <motion.button
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.01 }}
              className={styles["button-delete"]}
              onClick={handleDelete}
            >
              <Close />
            </motion.button>
          </div>
          <input
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
                initial={{ opacity: 0, x: "-8px", scale: 1 }}
                whileHover={{ scale: 1.01 }}
                animate={{ x: ["-8px", "0px"], opacity: [0, 1] }}
                key={film.slug}
                href={`https://www.letterboxd.com/${film.slug}`}
                transition={{ delay: index * 0.1 }}
              >
                {film.alt}
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const Boxes = ({ state, setState, setMatch }: any) => {
  const handleDelete = useCallback(
    (id: string) => {
      if (state.length === 2) {
        toast.error(err);
        return;
      }

      setMatch(false);
      setState((prev: Array<Data>) => {
        return [...prev.filter((i) => i.id !== id)];
      });
    },
    [setMatch, setState, state.length]
  );

  const handleUsername = useCallback(
    (id: string, username: string) => {
      setState((prev: Array<Data>) => {
        return [
          ...prev.map((i) => {
            if (i.id === id) {
              i.username = username;
            }

            return i;
          }),
        ];
      });
    },
    [setState]
  );

  return (
    <AnimatePresence>
      {state.map((data: Data, i: number) => (
        <Box
          handleDelete={() => {
            handleDelete(data.id);
          }}
          handleUsername={(username: string) => {
            handleUsername(data.id, username);
          }}
          data={data}
          animate={i > 1}
          key={data.id}
        />
      ))}
      ;
    </AnimatePresence>
  );
};

function boxData() {
  return {
    username: "",
    watchList: [],
    id: _.uniqueId(),
  };
}

export default function Home() {
  const [state, setState] = useState<Array<Data>>([boxData(), boxData()]);
  const [match, setMatch] = useState<Array<Film> | false>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addCard = useCallback(() => {
    if (state.length === 7) {
      toast.error("The maximum of users is 7!");
      return;
    }

    setState((prev) => {
      const clone = _.clone(prev);
      clone.push(boxData());
      return clone;
    });
  }, [state]);

  const send = useCallback(async () => {
    try {
      const users = state.map((data: Data) => data.username).filter((i) => i);
      if (users.length < 2) {
        toast.error(err);
        return;
      }

      setMatch(false);
      setIsLoading(true);

      if (process.env.API_URL) {
        await axios
          .post(process.env.API_URL, { users })
          .then((res) => {
            setState((prev) => {
              let clone = _.clone(prev);
              for (let box of clone) {
                box.watchList = res.data.result[box.username];
              }
              return clone;
            });

            setMatch(res.data.match);
          })
          .catch(
            ({
              response: {
                data: { error },
              },
            }) => {
              toast.error(error);
            }
          );
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }, [state]);

  return (
    <main className={styles.main}>
      <div className={styles["button-send-wrap"]}>
        <motion.button
          className={styles["button-send"]}
          onClick={send}
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isLoading}
        >
          {isLoading ? (
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
          ) : (
            "Send"
          )}
        </motion.button>
      </div>
      <div className={styles.grid}>
        <Boxes state={state} setState={setState} setMatch={setMatch} />
        {match ? (
          <Match data={match}></Match>
        ) : (
          <motion.div
            transition={{ duration: 0.1, type: "tween", ease: "easeOut" }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1] }}
            className={styles["button-add-wrap"]}
          >
            <motion.button
              className={styles["button-add"]}
              initial={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={addCard}
            >
              <Plus />
            </motion.button>
          </motion.div>
        )}
      </div>
    </main>
  );
}