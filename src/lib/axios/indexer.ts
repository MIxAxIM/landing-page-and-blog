import axios from "axios";
import { env } from "~/env";

export const indexer = axios.create({
  baseURL: env.API_URL,
  headers: { cache: "no-store" },
});

// Helper function for consistent serialization
const serializeToPlainObject = <T>(data: T): T => {
  try {
    // Handle null/undefined
    if (!data) return data;

    // If it's already a plain object with no constructor, return it
    if (data.constructor === Object) return data;

    // Otherwise serialize it
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Serialization error:', error);
    // Return original data if serialization fails
    return data;
  }
};

export async function indexerGet<T>(url: string): Promise<T> {
  console.log("Check URL", url);
  try {
    const res = await indexer.get<T>(url);
    if (res.status === 200) {
      return serializeToPlainObject(res.data);
    }
    throw new Error(`Failed to fetch data from indexer: ${res.statusText}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log the actual error response
      console.error('Axios error response:', error.response?.data);

      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }
    throw error;
  }
}

export async function indexerGetWithParams<T, U>(
  url: string,
  params: U,
): Promise<T> {
  try {
    const res = await indexer.get<T>(url, { params: params });
    if (res.status === 200) {
      return serializeToPlainObject(res.data);
    }
    throw new Error(`Failed to fetch data from indexer: ${res.statusText}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log the actual error response
      console.error('Axios error response:', error.response?.data);

      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }
    throw error;
  }
}
