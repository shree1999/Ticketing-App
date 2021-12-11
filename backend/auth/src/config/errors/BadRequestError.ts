import { Base } from "./Base";

export class BadRequestError extends Base {
  statusCode: number = 400;

  constructor(public message: string) {
    super("Bad Request error invoked");
  }

  serializeError(): { success: boolean; message: string } {
    return { success: false, message: this.message };
  }
}
