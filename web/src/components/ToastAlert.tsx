import classNames from "classnames"
import { FC, MouseEvent, ReactNode } from "react"
import { toast, ToastOptions } from "react-toastify"
import { IconChecks, IconAlertCircle, IconLoader } from "@tabler/icons-react"

type ToastAlertType = "success" | "error" | "loading"

const ToastAlertIcon: FC<{ type: ToastAlertType }> = ({ type }) => {
  switch (type) {
    case "success":
      return <IconChecks />
    case "error":
      return <IconAlertCircle />
    case "loading":
      return <IconLoader />
  }
}

type ToastAlertProps = {
  title: ReactNode
  subtitle?: ReactNode
  type: ToastAlertType
  onClick?: (e: MouseEvent) => void
}

export const ToastAlert: FC<ToastAlertProps> = ({ title, subtitle, type }) => {
  return (
    <div className="flex w-[422px] items-center gap-3">
      <div className="text-[40px]">
        <ToastAlertIcon type={type} />
      </div>
      <div className="flex grow flex-col overflow-hidden">
        <div className="text-normal font-bold text-black dark:text-white">{title}</div>
        {subtitle && (
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

export const showToastAlert = (
  type: ToastAlertType,
  title: ReactNode,
  subtitle?: ReactNode,
  options?: ToastOptions
) => {
  return toast(() => <ToastAlert type={type} title={title} subtitle={subtitle} />, {
    autoClose: false,
    className: classNames(
      "rounded-lg border border-neutral-200 shadow bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 ",
      options?.className?.toString?.()
    ),
    ...options,
  })
}

export const dismissToastAlert = (id: string) => {
  toast.dismiss(id)
}

export const dismissToastAlerts = () => {
  toast.dismiss()
}
