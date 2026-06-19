export class LegacySlackAPI {
  public postToChannel(text: string, heading: string): void {
    console.log(`Posting to Slack -> Heading: '${heading}' | Text: '${text}'`);
  }
}
