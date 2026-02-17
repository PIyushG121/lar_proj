/**
 * Currency and Date formatting utilities
 */

const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
});

/**
 * Formats a number or string as INR currency
 */
export const formatCurrency = (amount: number | string): string => {
    const value = typeof amount === 'string'
        ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0
        : amount;
    return currencyFormatter.format(value);
};

/**
 * Parses a currency string to a number
 */
export const parseCurrency = (amount: string | number | undefined | null): number => {
    if (amount === undefined || amount === null) return 0;
    if (typeof amount === 'number') return amount;
    return parseFloat(amount.toString().replace(/[^0-9.-]+/g, "")) || 0;
};

/**
 * Formats a date string to a readable format (DD MMM YYYY)
 */
export const formatDate = (date: string | Date | undefined | null): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};
