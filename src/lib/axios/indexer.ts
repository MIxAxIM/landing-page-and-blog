import axios from "axios";
import { INDEXER_URL } from "~/config/indexer";

export const indexer = axios.create({
  baseURL: `${INDEXER_URL}`,
  headers: { cache: "no-store" },
});

export async function indexerGet<T>(url: string): Promise<T> {
  console.log("Check URL", url);
  const res = await indexer.get<T>(url);
  if (res.status === 200) {
    return res.data;
  }
  throw new Error("Failed to fetch data from indexer");
}

export async function indexerGetWithParams<T, U>(
  url: string,
  params: U,
): Promise<T> {
  console.log("Check URL", url);
  const res = await indexer.get<T>(url, { params: params });
  if (res.status === 200) {
    return res.data;
  }
  throw new Error("Failed to fetch data from indexer");
}
