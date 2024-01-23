type MessageResponse = {
  message: string;
};

type PostMessage = {
  message: string;
  id: Promise<number>;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type UploadResponse = MessageResponse & {
  id: number;
};

export {MessageResponse, ErrorResponse, UploadResponse, PostMessage};
