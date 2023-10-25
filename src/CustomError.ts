export default class CustomError extends Error {
  constructor(
    public type: string = 'GENERIC',
    public status: number = 400,
    ...params: any[]
  ) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.type = type;
    this.status = status;
  }
}
