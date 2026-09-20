import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `ui-button ui-button-primary ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
