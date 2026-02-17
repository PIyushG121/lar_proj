/**
 * Currency and Date formatting utilities
 * Version: 1.1.0 - Highly Optimized
 */

// Pre-compiled regex for performance in tight loops
const CURRENCY_CLEANUP_REGEX = /[^0-9.-]+/g;

const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
});

/**
 * Formats a number or string as INR currency.
 * Handles parsing if a string is provided.
 */
export const formatCurrency = (amount: number | string): string => {
    const value = typeof amount === 'number' ? amount : parseCurrency(amount);
    return currencyFormatter.format(value);
};

/**
 * Parses a currency string to a number.
 * Uses a pre-compiled regex for performance.
 */
export const parseCurrency = (amount: string | number | undefined | null): number => {
    if (amount === null || amount === undefined) return 0;
    if (typeof amount === 'number') return amount;

    // Efficiently clean and parse the numeric string
    const cleaned = amount.toString().replace(CURRENCY_CLEANUP_REGEX, "");
    return parseFloat(cleaned) || 0;
};

/**
 * Formats a date string to a readable format (DD MMM YYYY)
 */
export const formatDate = (date: string | Date | undefined | null): string => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;

    // Check for invalid date
    if (isNaN(d.getTime())) return 'N/A';

    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};
