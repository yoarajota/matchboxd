import { Data } from "@/app/match/page";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import Box from "./Box";

const Boxes = ({ state, setState, setMatch }: any) => {
  const handleDelete = useCallback(
    (id: string) => {
      if (state.length === 2) {
        toast.error("Minimum of 2 accounts to match!");
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
          key={data.id}
        />
      ))}
      ;
    </AnimatePresence>
  );
};

export default Boxes;