import classNames from "classnames"
import { FC } from "react"
import { LayoutBackground } from "../../components/Layout/LayoutBackground"
import { usePlayground } from "./context"

export const Playground: FC = () => {
  const { image, metadata, handleRandom, error } = usePlayground()
  return (
    <div className="pb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="grow">
          <h1 className="text-3xl font-bold text-neutral-300">Playground</h1>
        </div>
        <button type="button" onClick={handleRandom} className="btn primary">
          Random
        </button>
      </div>
      <div className="my-8 flex w-full flex-col gap-8">
        <div className="flex w-full flex-col items-center justify-center gap-8 sm:flex-row">
          <div
            className={classNames(
              "flex flex-col items-center justify-center",
              "w-[300px] max-w-[300px]"
            )}
          >
            {image ? (
              <img
                alt=""
                src={image}
                className="inline-block aspect-square w-full max-w-[300px] rounded-xl"
              />
            ) : (
              <div className="inline-block aspect-square w-full max-w-[300px] animate-pulse rounded-xl"></div>
            )}
          </div>
          <pre
            className={classNames(
              "h-80 w-full min-w-0 max-w-full grow overflow-auto rounded-xl bg-neutral-800 p-4 text-sm",
              !metadata && "animate-pulse"
            )}
          >
            {metadata && JSON.stringify(metadata, undefined, 2)}
          </pre>
        </div>
      </div>
      <div className="text-red-500">{error?.message}</div>
      <LayoutBackground metadata={metadata} />
    </div>
  )
}
