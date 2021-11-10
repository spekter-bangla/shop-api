interface ResponseBodyWithMessage {
  message: string;
}

interface ResponseBodyWithData<T> {
  data: T;
}

interface ResponseBodyWithMessageAndData<T> {
  message: string;
  data: T;
}

export type ResponseBody<T = void> = T extends void
  ? ResponseBodyWithMessage
  : ResponseBodyWithData<T> | ResponseBodyWithMessageAndData<T>;
