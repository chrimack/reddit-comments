type Query = Record<string, string | number | boolean>;

export type RequestInitWithQuery = RequestInit & {
  query?: Query;
};
