export interface ParamsType {
  params: Promise<{
    [key: string]: string[] | string;
  }>;
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}