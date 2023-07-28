export type Film = {
  alt: string;
  slug: string;
};

export type WatchList = {
  watchlist: Array<Film>;
  username: string;
};

export type Films = {
  films: Array<Film>;
  username: string;
};

export type Result = {
  [key: string]: Array<Film>;
};

export type Scope = "watchlist" | "films";
