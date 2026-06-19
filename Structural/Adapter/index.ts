import { LegacySlackAPI } from "./adaptee";
import { NotificationService, SlackNotificationAdapter } from "./adapter";

function notifyAdmin(service: NotificationService): void {
  service.send("System Alert", "The server CPU is at 99%.");
}

const legacyApi = new LegacySlackAPI();

const adapter = new SlackNotificationAdapter(legacyApi);

notifyAdmin(adapter);
