export abstract class Handler {
  private nextHandler: Handler | undefined;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(request: string): void {
    if (this.nextHandler) {
      this.nextHandler.handle(request);
    } else {
      console.log(`[System] Unhandled request: '${request}'. No suitable handler found.`);
    }
  }
}
