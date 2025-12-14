import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  size?: "default" | "sm" | "xs" | "xxs"
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size = "default", ...props }, ref) => {
  const sizeClasses =
    size === "xxs"
      ? "h-1.5 w-1.5"
      : size === "xs"
        ? "h-3 w-3"
        : size === "sm"
          ? "h-3.5 w-3.5"
          : "h-4 w-4"
  const iconClasses =
    size === "xxs"
      ? "h-1.5 w-1.5"
      : size === "xs"
        ? "h-2 w-2"
        : size === "sm"
          ? "h-2.5 w-2.5"
          : "h-3 w-3"

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer shrink-0 rounded-[4px] border bg-white ring-offset-background transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        sizeClasses,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className={iconClasses} strokeWidth={size === "xxs" ? 3 : 2.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
