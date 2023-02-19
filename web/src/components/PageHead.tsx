import { FC, PropsWithChildren, ReactNode } from "react"

type PageHeadProps = {
  title: ReactNode
  subtitle?: ReactNode
} & PropsWithChildren

export const PageHead: FC<PageHeadProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center">
      <div className="grow">
        <h1 className="text-3xl font-bold text-neutral-300">{title}</h1>
        <div className="text-neutral-500">{subtitle}</div>
      </div>
      <div>{children}</div>
    </div>
  )
}
