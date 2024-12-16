export class EmailNotConfirmedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailNotConfirmedException";
  }
}

export function isEmailNotConfirmedException(
  error: any
): error is EmailNotConfirmedException {
  return error instanceof EmailNotConfirmedException;
}
