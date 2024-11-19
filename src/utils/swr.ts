import { AxiosError } from "axios";
import useSWR, { SWRConfiguration, mutate } from "swr";
import { Key, SWRResponse } from "swr";
import { apiAuth } from "./http";

export const fetcher = (url: string) =>
  apiAuth.get(url).then((res) => res.data);

export const useGetPermenant = <T>(url: Key): SWRResponse<T, AxiosError> => {
  return useSWR<T>(url, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
};

export const useGetUpdate = <T>(url: Key): SWRResponse<T, AxiosError> => {
  return useSWR<T>(url, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
  });
};

export const useGet = <T>(
  url: Key,
  config?: SWRConfiguration
): SWRResponse<T, AxiosError> => {
  return useSWR<T>(url, fetcher, config);
};

export const mutateUrl = (url: Key) => {
  mutate(url);
};
