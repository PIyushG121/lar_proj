"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AuroraTextProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    children: React.ReactNode;
    as?: React.ElementType;
}

export function AuroraText({
    className,
    children,
    as: Component = "span",
    ...props
}: AuroraTextProps) {
    return (
        <Component
            className={cn(
                "relative inline-flex overflow-hidden bg-[linear-gradient(to_right,#ea580c,#f59e0b,#ea580c)] bg-[length:200%_auto] bg-clip-text text-transparent animate-aurora",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}
