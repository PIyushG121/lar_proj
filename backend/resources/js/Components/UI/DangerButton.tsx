import { ButtonHTMLAttributes } from 'react';

export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `ui-button ui-button-danger ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
