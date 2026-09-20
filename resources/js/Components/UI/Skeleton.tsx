import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    circle?: boolean;
}

export default function Skeleton({ className = '', width, height, circle = false }: SkeletonProps) {
    return (
        <div 
            className={`animate-pulse bg-white/5 ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`} 
            style={{ width, height }}
        />
    );
}
