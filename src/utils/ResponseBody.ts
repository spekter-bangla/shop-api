export interface ResponseBody<T> {
  message?: string;
  count?: number;
  data: T;
}
