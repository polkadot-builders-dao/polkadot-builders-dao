/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly DEPLOYER_MOONBASE: string
    readonly DEPLOYER_MOONBEAM: string
    readonly FOUNDERS: string
    readonly DAO: string
    readonly MOONSCAN_API_KEY: string
  }
}
