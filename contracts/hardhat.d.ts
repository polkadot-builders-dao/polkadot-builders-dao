/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly DEPLOYER_MOONBASE: string
    readonly DEPLOYER_MOONBEAM: string
    readonly FOUNDERS_MOONBASE: string
    readonly FOUNDERS_MOONBEAM: string
    readonly DAO_MOONBASE: string
    readonly DAO_MOONBEAM: string
    readonly MOONSCAN_API_KEY: string
    readonly NODE_ENV: string
  }
}
