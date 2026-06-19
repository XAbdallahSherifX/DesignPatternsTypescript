import { LegacySlackAPI } from "./adaptee";

export interface NotificationService {
  send(title: string, message: string): void;
}

export class SlackNotificationAdapter implements NotificationService {
  private slackApi: LegacySlackAPI;

  constructor(slackApi: LegacySlackAPI) {
    this.slackApi = slackApi;
  }

  public send(title: string, message: string): void {

    this.slackApi.postToChannel(message, title);
  }
}
