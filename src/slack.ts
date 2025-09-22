import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { Message, MessageBuilder, SlackMessageDto } from "slack-block-builder";
import glossaryData from "./glossary.json";

import { assertHasProperty, BuildModel, createSlackMessage } from "./utils";
dotenv.config();

export const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  appToken: process.env.SLACK_APP_TOKEN!,
  socketMode: true,
});

const glossary: Record<string, string> = glossaryData;

const findMatch = (text: string): Record<string, string> => {
  const matches: Record<string, string> = {};

  for (const term of Object.keys(glossary)) {
    const regex = new RegExp(`\\b${term}\\b`, "i");
    if (regex.test(text)) {
      matches[term] = glossary[term];
    }
  }
  return matches;
};

slackApp.message(async ({ message, say, client }) => {
  const slackMessage = createSlackMessage(message);
  if (!slackMessage) return;
  const matchedTerms = findMatch(slackMessage.text);

  if (Object.keys(matchedTerms).length > 0) {
    await client.chat.postEphemeral({
      channel: slackMessage.channel,
      user: slackMessage.user,
      blocks: BuildModel(matchedTerms),
    });
  }
});

slackApp.event("app_mention", async ({ event, say }) => {
  await say(`👋 Hello <@${event.user}>! You mentioned me.`);
});

slackApp.command("/slacky", async ({ body, ack, respond }) => {
  console.log(body);
  await ack();
  // await sleep(30 * 1000); //
  await respond("🚀 Slacky app (Express + TS) is alive!");
});

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
