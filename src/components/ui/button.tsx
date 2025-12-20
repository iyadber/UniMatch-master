import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none relative group overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-pink-600 text-white hover:shadow-md hover:shadow-blue-500/20 dark:hover:shadow-pink-500/20 disabled:opacity-50",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-md hover:shadow-red-500/20 disabled:opacity-50",
        outline:
          "border border-input bg-background/80 backdrop-blur-sm hover:bg-accent/50 hover:text-accent-foreground",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 hover:shadow-md dark:hover:shadow-gray-800/20",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-blue-600 to-pink-600 text-white hover:shadow-md hover:shadow-blue-500/20 dark:hover:shadow-pink-500/20 disabled:opacity-50 border border-white/10 dark:border-black/10"
      },
      size: {
        default: "h-12 px-5 py-3",
        sm: "h-10 rounded-lg px-4 py-2",
        lg: "h-14 rounded-xl px-6 py-3.5 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>,
    Omit<HTMLMotionProps<"button">, 'children'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, icon, children, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {/* Hover effect overlay */}
        <span className="absolute inset-0 w-full h-full bg-white/0 group-hover:bg-white/10 dark:group-hover:bg-white/5 transition-all duration-200" />
        
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
            <svg 
              className="animate-spin h-5 w-5 text-white/70" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        
        {/* Button content */}
        <div className={`flex items-center justify-center ${isLoading ? 'invisible' : 'visible'}`}>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </div>
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 