import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-[52px] w-full rounded-[8px] border border-line bg-bg px-3.5 text-base text-ink placeholder:text-muted/70 transition focus:border-brand-600 focus:outline-none focus:ring-3 focus:ring-brand-100 disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
