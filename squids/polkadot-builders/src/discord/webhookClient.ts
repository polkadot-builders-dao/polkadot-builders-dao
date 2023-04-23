/* eslint-disable turbo/no-undeclared-env-vars */
import { WebhookClient } from "discord.js"

const WEBHOOK_CONFIG = {
  // parameters are defined as subsquid secrets
  id: process.env.DISCORD_WEBHOOK_ID ?? (process.env.DEV_DISCORD_WEBHOOK_ID as string),
  token: process.env.DISCORD_WEBHOOK_TOKEN ?? (process.env.DEV_DISCORD_WEBHOOK_TOKEN as string),
}

export const webhookClient = new WebhookClient(WEBHOOK_CONFIG)
