"use client";

import React, { MouseEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RippleButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    rippleColor?: string;
    duration?: string;
    rippleOnHover?: boolean;
}

export function RippleButton({
    className,
    children,
    rippleColor = "#ffffff",
    duration = "600ms",
    onClick,
    rippleOnHover = false,
    ...props
}: RippleButtonProps) {
    const [buttonRipples, setButtonRipples] = useState<Array<{ x: number; y: number; size: number; key: number }>>([]);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        createRipple(e);
        onClick?.(e);
    };

    const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
        if (rippleOnHover) {
            createRipple(e);
        }
    };

    const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple = { x, y, size, key: Date.now() };
        setButtonRipples((prev) => [...prev, newRipple]);
    };

    useEffect(() => {
        if (buttonRipples.length > 0) {
            const lastRipple = buttonRipples[buttonRipples.length - 1];
            const timeout = setTimeout(() => {
                setButtonRipples((prev) => prev.filter((r) => r.key !== lastRipple.key));
            }, parseInt(duration));
            return () => clearTimeout(timeout);
        }
    }, [buttonRipples, duration]);

    return (
        <button
            className={cn(
                "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-background px-4 py-2 text-center text-sm font-medium text-primary shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            {...props}
        >
            <div className="relative z-10 flex items-center gap-2">{children}</div>
            <span className="pointer-events-none absolute inset-0">
                {buttonRipples.map((ripple) => (
                    <span
                        key={ripple.key}
                        className="absolute animate-ripple rounded-full opacity-30"
                        style={{
                            width: ripple.size,
                            height: ripple.size,
                            top: ripple.y,
                            left: ripple.x,
                            backgroundColor: rippleColor,
                            animationDuration: duration,
                            transform: "scale(0)",
                        }}
                    />
                ))}
            </span>
        </button>
    );
}
