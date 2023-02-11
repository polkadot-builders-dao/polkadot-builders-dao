/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly DEPLOYER_MOONBASE: string
    readonly DEPLOYER_MOONBEAM: string
    readonly MOONSCAN_API_KEY: string
  }
}
