import { Base } from "./Base";

export class NotAuthorizeError extends Base {
  statusCode: number = 401;

  constructor(public message: string) {
    super("Not authorize error invoked");
  }

  serializeError(): { success: boolean; message: string } {
    return { success: false, message: this.message };
  }
}
