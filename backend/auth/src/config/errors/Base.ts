export abstract class Base extends Error {
  abstract statusCode: number;

  constructor(public message: string) {
    super(message);
  }

  abstract serializeError(): {
    success: boolean;
    message: string;
  };
}
