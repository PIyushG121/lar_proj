import React from "react";
import { cn } from "@/lib/utils";

interface RainbowButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export function RainbowButton({
    children,
    className,
    ...props
}: RainbowButtonProps) {
    return (
        <button
            className={cn(
                "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-white transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",

                // Layer 1: Button Face (Orange)
                // Layer 2: Transition/Shimmer? (Orange with Alpha)
                // Layer 3: Rainbow Gradient (Using our custom --color vars)
                "bg-[linear-gradient(#f27f0d,#f27f0d),linear-gradient(#f27f0d_50%,rgba(242,127,13,0.6)_80%,#f27f0d),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",

                // Outer Glow/Blur
                "before:absolute before:bottom-[-10%] before:left-1/2 before:z-0 before:h-[10%] before:w-[50%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-[length:200%] before:blur-[15px] before:opacity-60",

                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
