import json from "./deployments.json"

export const deployments = json

export const getContractAddress = (
  contractName: keyof typeof deployments,
  chainId: string | number
) => {
  const deployment = deployments[contractName] as unknown as Record<
    string,
    { address: `0x${string}` }
  >
  return deployment[String(chainId)].address
}
