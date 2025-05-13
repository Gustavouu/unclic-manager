
import * as React from "react"
import { toast } from "sonner"

type ToastProps = React.ComponentPropsWithoutRef<typeof toast>
type ToastActionElement = React.ReactElement<typeof toast>

export type ToastActionProps = {
  altText: string
} & React.ComponentPropsWithoutRef<typeof toast>

export type Toast = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success" | "warning" | "info"
} & ToastProps

const actionTypes = {
  default: toast,
  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  info: toast.info
} as const

type ActionType = keyof typeof actionTypes

export const useToast = () => {
  const showToast = React.useCallback(
    ({ title, description, variant = "default", ...props }: Toast) => {
      const actionType = (variant === "destructive" ? "error" : variant) as ActionType
      const toastFunction = actionTypes[actionType] || toast
      
      return toastFunction(title, {
        description,
        ...props,
      })
    },
    []
  )

  return {
    toast: showToast,
    dismiss: toast.dismiss,
    toasts: [] // For compatibility with older implementations
  }
}

// Re-export the toast methods for convenience
export { toast }
