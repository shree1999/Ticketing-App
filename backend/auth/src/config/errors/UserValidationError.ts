import { ValidationError } from "joi";

import { Base } from "./Base";

export class UserValidationError extends Base {
  statusCode: number = 400;

  constructor(private error: ValidationError) {
    super("User validation error invoked");
  }

  serializeError(): { success: boolean; message: string } {
    return { success: false, message: this.error.details[0].message };
  }
}
