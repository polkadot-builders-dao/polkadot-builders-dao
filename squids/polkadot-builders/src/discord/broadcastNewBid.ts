import { EmbedBuilder } from "discord.js"
import { Bid } from "../model"
import { formatEther } from "ethers/lib/utils"
import { BigNumber } from "ethers"
import { webhookClient } from "./webhookClient"

export const broadcastNewBid = async (bid: Bid) => {
  try {
    //only broadcast if the event occured in the last 10 minutes
    const minTimestamp = BigInt(Date.now()) - 600000n
    if (bid.timestamp < minTimestamp) {
      return
    }

    const embed = new EmbedBuilder({
      title: `New bid on ${bid.token.name}`,
      url: "https://app.polkadotbuilders.xyz",
      description: `Bid : ${formatEther(BigNumber.from(bid.value))} GLMR\nFrom : ${bid.bidder}`,
    })

    await webhookClient.send({
      embeds: [embed],
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to broadcast bid", { err })
  }
}
