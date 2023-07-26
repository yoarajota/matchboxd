'use client'

import { useState, useCallback } from 'react'
import styles from './page.module.css'
import { AnimatePresence, motion } from 'framer-motion'
import { Film } from '../../types'
import _ from 'lodash'
import axios from 'axios'

type Data = {
  username: string,
  watchList: Array<Film>,
  id: string
}

const Box = ({ animate, data, handleDelete, handleUsername }: any) => {
  return <motion.div
    transition={{ duration: 0.1, type: "tween", ease: "easeOut" }}
    exit={{ scale: [1, 0] }}
    initial={{ scale: 1 }}
    animate={animate ? { scale: [0, 1] } : {}}
    className={styles.box}>
    <div>
      <div className={styles['input-container']}>
        <button className={styles['button-delete']} onClick={handleDelete}>
          x
        </button>
        <input onChange={({ target: { value } }) => handleUsername(value)} type="text" className={styles.input} placeholder="Letterboxd username" />
      </div>
      <button onClick={handleDelete} />
    </div>
  </motion.div>
}

const Boxes = ({ state, setState }: any) => {
  const handleDelete = useCallback((id: string) => {
    if (state.length === 2) {
      return
    }

    setState((prev: Array<Data>) => {
      return [...prev.filter((i) => i.id !== id)];
    })
  }, [setState, state])

  const handleUsername = useCallback((id: string, username: string) => {
    setState((prev: Array<Data>) => {
      return [...prev.map((i) => {
        if (i.id === id) {
          i.username = username;
        }

        return i
      })];
    })
  }, [setState])

  return <AnimatePresence>
    {state.map((data: Data, i: number) => <Box
      handleDelete={() => { handleDelete(data.id) }}
      handleUsername={(username: string) => { handleUsername(data.id, username) }}
      animate={i > 1}
      key={data.id} />)}
  </AnimatePresence>;
}

function boxData() {
  return {
    username: "",
    watchList: [],
    id: _.uniqueId()
  }
}

export default function Home() {
  const [state, setState] = useState<Array<Data>>([boxData(), boxData()])

  const addCard = useCallback(() => {
    if (state.length === 7) {
      return;
    }

    setState((prev) => {
      const clone = [...prev];
      clone.push(boxData())
      return clone;
    })
  }, [state])

  const send = useCallback(() => {
    const users = state.map((data: Data) => data.username)

    if (process.env.API_URL) {
      axios.post(process.env.API_URL, { users })
    }
  }, [state])

  return (
    <main className={styles.main}>
      <div className={styles['button-send-wrap']} >
        <motion.button className={styles['button-send']} onClick={send} initial={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
          Enviar
        </motion.button>
      </div>
      <div className={styles.grid}>
        <Boxes state={state} setState={setState} />
        <motion.button className={styles.button} initial={{ scale: 1 }} whileTap={{ scale: 0.9 }} onClick={addCard}>
        </motion.button>
      </div>
    </main >
  )
}
