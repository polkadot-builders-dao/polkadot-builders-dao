import classNames from "classnames"
import { FC } from "react"

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export const Button: FC<ButtonProps> = (props) => {
  return (
    <button
      type="button"
      {...props}
      className={classNames(
        "text-normal inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded px-4 py-2 font-medium transition-colors sm:text-xl",
        "bg-white  text-neutral-950 hover:bg-neutral-300",
        "disabled:cursor-not-allowed disabled:bg-neutral-800  disabled:text-neutral-500",
        props.className
      )}
    />
  )
}
