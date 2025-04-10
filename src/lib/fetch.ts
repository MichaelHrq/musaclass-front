type propsType = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  route: string;
  body?: BodyInit;
  headers?: HeadersInit;
  next?: NextFetchRequestConfig;
};

export type ApiResponse = {
  data: any | undefined;
  error: string | undefined;
  status: number;
};

export async function fetchApi({
  route,
  method,
  body,
  headers,
  next,
}: propsType): Promise<ApiResponse> {
  try {
    const resp = await fetch(route, { method, body, headers, next });

    console.log(resp);

    if (!resp.ok) {
      const error = await resp
        .json()
        .catch(() => ({ message: resp.statusText }));
      return {
        data: undefined,
        error: error.message || `HTTP error ${resp.status}`,
        status: resp.status,
      };
    }

    const data = await resp.json();
    return { data, error: undefined, status: resp.status };
  } catch (error) {
    return {
      data: undefined,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      status: 500,
    };
  }
}
