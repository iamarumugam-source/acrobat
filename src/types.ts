import { SlackBlockDto, SlackMessageDto } from "slack-block-builder";

export interface SlackEventBase {
  type: string;
  channel: string;
  ts: string;
  team?: string;
  event_ts?: string;
  channel_type?: string;
}

export interface SlackUserMessage extends SlackEventBase {
  type: "message";
  user: string;
  text: string;
  subtype?: undefined;
  blocks: SlackBlockDto;
}

export type SlackMessage = SlackUserMessage;
