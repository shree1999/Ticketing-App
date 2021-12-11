import { Base } from "./Base";

export class NotFoundError extends Base {
  statusCode: number = 404;

  constructor(public message: string) {
    super("Not found error invoked");
  }

  serializeError(): { success: boolean; message: string } {
    return { success: false, message: this.message };
  }
}
