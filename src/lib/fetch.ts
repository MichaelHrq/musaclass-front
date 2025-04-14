type propsType = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  route: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
  next?: NextFetchRequestConfig;
};

export type ApiResponse = {
  data: any | undefined;
  error: string | undefined;
  status: number;
  sucess: boolean;
};

export async function fetchApi({
  route,
  method,
  body,
  headers,
  next,
}: propsType): Promise<ApiResponse> {
  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/${route}`, {
      method,
      body,
      headers,
      next,
    });

    console.log(resp)
    
    if (!resp.ok) {
      const error = await resp
        .json()
        .catch(() => ({ message: resp.statusText }));
      return {
        data: undefined,
        error: error.message || `HTTP error ${resp.status}`,
        status: resp.status,
        sucess: false,
      };
    }

    const data = await resp.json();
    return { data, error: undefined, status: resp.status, sucess: true };
  } catch (error) {
    return {
      data: undefined,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      status: 500,
      sucess: false,
    };
  }
}
