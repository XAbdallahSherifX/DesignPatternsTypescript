import { Handler } from "./handler.ts";

export class BasicHandler extends Handler {
  handle(request: string): void {
    if (request === "basic") {
      console.log("[Basic Support] Successfully handled the request.");
    } else {
      super.handle(request);
    }
  }
}

export class TechnicalHandler extends Handler {
  handle(request: string): void {
    if (request === "technical") {
      console.log("[Technical Support] Successfully handled the request.");
    } else {
      super.handle(request);
    }
  }
}

export class ManagerHandler extends Handler {
  handle(request: string): void {
    if (request === "manager") {
      console.log("[Manager Support] Successfully handled the request.");
    } else {
      super.handle(request);
    }
  }
}
