import { useFetch, type UseFetchReturnValue } from "@mantine/hooks";
// import { ofetch } from "ofetch";

export const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:8000";

// export const apiFetch = ofetch.create({
//   baseURL: BASE_URL,
// });

type CustomFetchReturnValue<T> = Omit<UseFetchReturnValue<T>, "data"> & {
  data: T;
};

export const useAPI = <T>(path: string, initialData?: T) => {
  const result = useFetch<T>(`${BASE_URL}${path}`) as CustomFetchReturnValue<T>;
  if (initialData && result.data === null) {
    result.data = initialData;
    return result;
  }
  return result;
};
