import { redirect } from "next/navigation";

type propsType = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  route: string;
  body?: BodyInit;
  headers?: HeadersInit;
  next?: NextFetchRequestConfig;
};

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

export async function fetchApi<T = any>({
    route,
    method,
    body,
    headers,
    next,
  }: propsType): Promise<ApiResponse<T>> {
    try {
      const resp = await fetch(route, { method, body, headers, next });
  
      if (!resp.ok) {
        const error = await resp.json().catch(() => ({ message: resp.statusText }));
        return { 
          data: null, 
          error: error.message || `HTTP error ${resp.status}`,
          status: resp.status 
        };
      }
  
      const data = await resp.json();
      return { data, error: null, status: resp.status };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      };
    }
  }