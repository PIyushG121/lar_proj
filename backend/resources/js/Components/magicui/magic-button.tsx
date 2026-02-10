import React from "react";
import { cn } from "@/lib/utils";

interface MagicButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export function MagicButton({
    children,
    className,
    ...props
}: MagicButtonProps) {
    return (
        <button
            className={cn(
                "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-white transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",

                // Magic Gradient (Purple, Blue, Pink, Cyan)
                "bg-[linear-gradient(#4f46e5,#4f46e5),linear-gradient(#4f46e5_50%,rgba(79,70,229,0.6)_80%,#4f46e5),linear-gradient(90deg,hsl(262,80%,50%),hsl(217,91%,60%),hsl(316,73%,52%),hsl(190,90%,50%),hsl(262,80%,50%))]",

                // Outer Glow/Blur
                "before:absolute before:bottom-[-10%] before:left-1/2 before:z-0 before:h-[10%] before:w-[50%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(262,80%,50%),hsl(217,91%,60%),hsl(316,73%,52%),hsl(190,90%,50%),hsl(262,80%,50%))] before:bg-[length:200%] before:blur-[15px] before:opacity-60",

                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
