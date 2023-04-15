import classNames from "classnames"

export const CrestShimmer = ({ className }: { className?: string }) => (
  <div
    className={classNames("h-[300px] w-[300px] animate-pulse rounded-xl bg-neutral-800", className)}
  />
)
