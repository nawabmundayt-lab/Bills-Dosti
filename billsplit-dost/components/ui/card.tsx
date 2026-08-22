import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[12px] border border-line bg-surface shadow-[0_1px_2px_rgb(22_33_27/0.06)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
