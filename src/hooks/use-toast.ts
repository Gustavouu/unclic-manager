
import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastProps = React.ComponentPropsWithoutRef<typeof sonnerToast>

export type ToastActionElement = React.ReactElement<typeof sonnerToast>

export type ToastActionProps = {
  altText: string
} & React.ComponentPropsWithoutRef<typeof sonnerToast>

export type Toast = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success" | "warning" | "info"
} & ToastProps

const actionTypes = {
  default: sonnerToast,
  success: sonnerToast.success,
  error: sonnerToast.error,
  warning: sonnerToast.warning,
  info: sonnerToast.info
} as const

type ActionType = keyof typeof actionTypes

export const useToast = () => {
  const showToast = React.useCallback(
    ({ title, description, variant = "default", ...props }: Toast) => {
      const actionType = (variant === "destructive" ? "error" : variant) as ActionType
      const toastFunction = actionTypes[actionType] || sonnerToast
      
      return toastFunction(title, {
        description,
        ...props,
      })
    },
    []
  )

  return {
    toast: showToast,
    dismiss: sonnerToast.dismiss,
    toasts: [] // For compatibility with older implementations
  }
}

// Re-export the toast methods for convenience
export { sonnerToast as toast }
