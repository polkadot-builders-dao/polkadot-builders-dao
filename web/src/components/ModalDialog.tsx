import { Dialog, Transition } from "@headlessui/react"
import classNames from "classnames"
import { FC, Fragment, ReactNode, useCallback } from "react"

type ModalDialogProps = {
  isOpen: boolean
  title: ReactNode
  children: ReactNode
  className?: string
  onClose?: () => void
}

export const ModalDialog: FC<ModalDialogProps> = ({
  isOpen,
  title,
  children,
  className,
  onClose,
}) => {
  const handleClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog open onClose={handleClose} className={className}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-20 bg-neutral-950/25 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 z-30 overflow-y-auto">
          <div
            className={classNames(
              "flex min-h-full items-center justify-center p-4 text-center",
              onClose && "cursor-pointer"
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md cursor-default space-y-4 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-8 text-center text-neutral-950 shadow-xl transition-all dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                <Dialog.Title
                  as="h3"
                  className="text-center text-2xl font-semibold leading-6 dark:text-white"
                >
                  {title}
                </Dialog.Title>
                <div className="text-base">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
