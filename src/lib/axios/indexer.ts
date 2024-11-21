import axios from "axios";
import { env } from "~/env";

export const indexer = axios.create({
  baseURL: env.API_URL,
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
  try {
    const res = await indexer.get<T>(url, { params: params });
    if (res.status === 200) {
      return res.data;
    }
    throw new Error("Failed to fetch data from indexer");

  }
  catch (error) {
    throw error;
  }
}
