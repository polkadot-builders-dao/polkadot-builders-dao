import { Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { default as clsx } from "clsx"
import { ReactNode } from "react"
import { createPortal } from "react-dom"

type DrawerProps = {
  show?: boolean
  onDismiss?: () => void
  title?: string
  children: ReactNode
  lightDismiss?: boolean
}

// const BodyScrollLock = ({ locked }: { locked?: boolean }) => {
//   // seems to break scroll on iOS
//   useLockBodyScroll(locked)
//   return null
// }

export const Drawer = ({ show = false, children, title, onDismiss, lightDismiss }: DrawerProps) => {
  return createPortal(
    <Transition show={show}>
      {/* <BodyScrollLock locked /> */}

      {/* Background overlay */}
      {lightDismiss && (
        <Transition.Child
          data-testid="sidepanel-overlay"
          className={clsx(
            "fixed left-0 top-0 z-40 h-full min-h-screen w-full bg-neutral-900 bg-opacity-50",
            onDismiss ? "cursor-pointer" : ""
          )}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          onClick={onDismiss}
        ></Transition.Child>
      )}

      {/* Sliding sidebar */}
      <Transition.Child
        data-testid="sidepanel-panel"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[100vw] flex-col bg-neutral-800 shadow-2xl sm:w-96"
        enter="transition ease-in-out duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="flex h-12 w-full bg-neutral-900 text-white">
          <div className="flex w-full flex-grow items-center pl-4 pr-1">
            <h3 data-testid="sidepanel-title" className="grow text-xl">
              {title}
            </h3>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="h-10 bg-opacity-0 p-2 transition hover:bg-opacity-20 active:bg-opacity-20"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
        <div className="flex-grow overflow-y-auto text-base font-normal">{children}</div>
      </Transition.Child>
    </Transition>,
    document.body
  )
}
