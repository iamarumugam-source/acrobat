import { KnownEventFromType } from "@slack/bolt";
import { SlackMessage } from "./types";
import {
  bold,
  Button,
  Context,
  Divider,
  Header,
  Message,
  Section,
  Img,
} from "slack-block-builder";

export function createSlackMessage(
  message: KnownEventFromType<"message">
): SlackMessage | null {
  if (message.type !== "message") return null;
  if ("subtype" in message && message.subtype !== undefined) return null;
  if (!("text" in message) || !message.text) return null;
  if (!("user" in message) || !message.user) return null;

  return {
    type: "message",
    user: message.user,
    channel: message.channel,
    text: message.text,
    ts: message.ts,
    blocks: (message as any).blocks,
  };
}

export function assertHasProperty<Obj extends object, Key extends string>(
  obj: Obj,
  key: Key
): asserts obj is Obj & Record<Key, NonNullable<any>> {
  if (!obj || !(key in obj)) {
    throw new Error(`Property "${key}" is missing`);
  }

  const value = (obj as unknown as Record<string, any>)[key];
  if (value === undefined || value === null) {
    throw new Error(`Property "${key}" is undefined or null`);
  }
}

export function BuildModel(message: Record<string, string>) {
  let sections = [];
  let contextElements = [];
  for (const mes in message) {
    sections.push(
      Section({
        text: `${bold(mes)}: ${message[mes]}`,
      }),
      Divider()
    );
  }

  return Message()
    .blocks(
      Header({
        text: "I found the following glossary terms in your message:",
      }),
      sections,
      Context().elements([":robot_face: This is sent from AcroBat"])
    )
    .getBlocks();
}
