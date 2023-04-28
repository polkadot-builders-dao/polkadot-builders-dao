import { FC } from "react"

export const ErrorPage: FC<{ error: unknown; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="flex h-full flex-col text-center">
      <h1 className="mt-72 text-5xl text-neutral-100">Oh no !!</h1>
      <p className="mt-6">Sorry fren, something went wrong :(</p>
      <p className="mt-4 text-red-300">{(error as Error)?.message ?? ""}</p>
      <div>
        <button onClick={resetErrorBoundary} className="btn primary mt-12">
          Reload page
        </button>
      </div>
    </div>
  )
}
