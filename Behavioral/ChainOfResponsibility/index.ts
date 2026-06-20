import { BasicHandler, ManagerHandler, TechnicalHandler } from "./support.ts";

const basicHandler = new BasicHandler();
const technicalHandler = new TechnicalHandler();
const managerHandler = new ManagerHandler();

// Wire the chain: Basic -> Technical -> Manager
basicHandler.setNext(technicalHandler).setNext(managerHandler);

const req1 = "basic";
const req2 = "technical";
const req3 = "manager";
const req4 = "unknown";

console.log("--- Sending requests to the support chain ---");
basicHandler.handle(req1);
basicHandler.handle(req2);
basicHandler.handle(req3);
basicHandler.handle(req4);
