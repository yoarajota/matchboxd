"use client";

import { useState, useCallback } from "react";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { Film } from "../../types";
import _ from "lodash";
import { toast } from "react-toastify";
import Plus from "@/svg/plus";
import HomeButton from "@/components/HomeButton";
import { FILMS, WATCHLIST, getFromLetterboxd } from "@/helpers/frontend";
import Boxes from "@/components/match/Boxes";
import Match from "@/components/match/Match";
import Loading from "@/components/Loading";

export type Data = {
  username: string;
  watchList: Array<Film>;
  id: string;
  isMatch?: boolean;
};

const fadeIn = {
  initial: { scale: 1, opacity: 0 },
  animate: { opacity: [0, 1] },
};

const err = "Minimum of 2 accounts to match!";

function boxData() {
  return {
    username: "",
    watchList: [],
    id: _.uniqueId(),
  };
}

export default function Page() {
  const [state, setState] = useState<Array<Data>>([boxData(), boxData()]);
  const [match, setMatch] = useState<Array<Film> | false>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [type, setType] = useState<number>(WATCHLIST);

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

  const reset = useCallback(async () => {
    setMatch(false);
  }, []);

  const send = useCallback(async () => {
    try {
      const users = state.map((data: Data) => data.username).filter((i) => i);
      if (users.length < 2) {
        toast.error(err);
        return;
      }

      setIsLoading(true);

      if (process.env.API_URL) {
        await getFromLetterboxd(type, { users })
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
                data: { error, status },
              },
            }) => {
              if (status === 504) {
                toast.error(
                  "Too much data to get! Try again or with other username."
                );
              } else {
                toast.error(error);
              }
            }
          );
      }
      setIsLoading(false);
    } catch (error) {
      reset();
      setIsLoading(false);
      toast.error("Something went wrong!");
    }
  }, [reset, state, type]);

  return (
    <main className={styles.main}>
      <HomeButton />
      <motion.div {...fadeIn} className={styles["button-send-wrap"]}>
        {match ? (
          <motion.button
            title="Reset the form"
            className={styles["button-send"]}
            onClick={reset}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 1 }}
            disabled={isLoading}
          >
            Let`s try again!
          </motion.button>
        ) : (
          <motion.button
            title="Send users"
            className={styles["button-send"]}
            onClick={send}
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isLoading}
          >
            {isLoading ? <Loading /> : "Send"}
          </motion.button>
        )}
      </motion.div>
      <motion.div {...fadeIn} className={styles["select-wrap"]}>
        <span>
          <motion.p
            animate={type !== WATCHLIST ? { opacity: 0.4 } : { scale: 1.05 }}
          >
            Watchlist
          </motion.p>
        </span>
        <span>
          <div
            className={styles.switch}
            data-ison={type === FILMS}
            onClick={() => {
              reset();
              setType((prev) => (prev === FILMS ? WATCHLIST : FILMS));
            }}
          >
            <motion.div
              className={styles.handle}
              layout
              transition={{
                type: "spring",
                stiffness: 700,
                damping: 30,
              }}
            />
          </div>
        </span>
        <span>
          <motion.p
            animate={type !== FILMS ? { opacity: 0.4 } : { scale: 1.05 }}
          >
            Films
          </motion.p>
        </span>
      </motion.div>
      <div
        className={styles.grid}
        style={{ pointerEvents: isLoading ? "none" : "auto" }}
      >
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
              title="Add new user"
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