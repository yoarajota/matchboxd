import axios, { AxiosPromise } from "axios";

export const WATCHLIST = 1;
export const FILMS = 2;
export function getFromLetterboxd(type: number, obj: any): AxiosPromise {
  let typeString;
  switch (type) {
    case WATCHLIST:
      typeString = "watchlist";
      break;
    case FILMS:
      typeString = "films";
      break;
    default:
      throw Error("Wrong type!");
  }

  return axios.post(process.env.API_URL + "/letterboxd", {
    ...obj,
    type: typeString,
  });
}
