import { Resvg } from "@resvg/resvg-js"
import { Token } from "../model"
import { webhookClient } from "./webhookClient"
import { AttachmentBuilder, EmbedBuilder } from "discord.js"

export const broadcastNewAuction = async (token: Token) => {
  try {
    //only broadcast if the event occured in the last 10 minutes
    const minTimestamp = BigInt(Date.now()) - 600000n

    if (token.timestamp < minTimestamp || !token.image) {
      return
    }

    const svgBuffer = new Buffer(token.image.split(",")[1], "base64")
    const resvg = new Resvg(svgBuffer.toString("utf-8"))
    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()

    const attachment = new AttachmentBuilder(pngBuffer, {
      name: "crest.png",
    })

    const embed = new EmbedBuilder()
      .setTitle(token.name as string)
      .setURL("https://app.polkadotbuilders.xyz")
      .setDescription("A new auction has begun!")
      .setImage("attachment://crest.png")

    await webhookClient.send({
      embeds: [embed],
      files: [attachment],
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to broadcast new auction", { err })
  }
}
