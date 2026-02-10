interface DashboardMetricsProps {
    metrics: any;
    onEditClick: (metric: string, value: string) => void;
    selectedMetric: string | null;
}

export default function DashboardMetrics({ metrics, onEditClick, selectedMetric }: DashboardMetricsProps) {
    if (!metrics) return null;

    // Helper to render trend
    const renderTrend = (trend?: string, direction?: string) => {
        if (!trend) return null;
        const isPositive = direction === 'up';
        const color = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
        const icon = isPositive ? 'trending_up' : 'trending_down';

        return (
            <span className={`flex items-center font-medium ${color}`}>
                <span className="material-symbols-outlined text-sm md:text-base mr-0.5 md:mr-1">{icon}</span>
                {trend} vs last month
            </span>
        );
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-8">
            {/* Revenue */}
            <div className={`relative bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${selectedMetric && selectedMetric !== 'revenue' ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Total Revenue
                        </h3>
                        <div className="flex items-baseline mt-1">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                {metrics.revenue?.value || "₹0.00"}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 md:p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg md:text-xl">
                            attach_money
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-xs md:text-sm">
                    {renderTrend(metrics.revenue?.trend, metrics.revenue?.trendDirection)}
                </div>
                <button
                    onClick={() => onEditClick('revenue', metrics.revenue?.value)}
                    className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1 md:p-1.5 bg-[#F97316] text-white rounded-md hover:bg-[#e06612] transition-colors"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">edit</span>
                </button>
            </div>

            {/* Net Profit */}
            <div className={`relative bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${selectedMetric && selectedMetric !== 'netProfit' ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Net Profit
                        </h3>
                        <div className="flex items-baseline mt-1">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                {metrics.netProfit?.value || "₹0.00"}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 md:p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg md:text-xl">
                            show_chart
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-xs md:text-sm">
                    {renderTrend(metrics.netProfit?.trend, metrics.netProfit?.trendDirection)}
                </div>
                <button
                    onClick={() => onEditClick('netProfit', metrics.netProfit?.value)}
                    className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1 md:p-1.5 bg-[#F97316] text-white rounded-md hover:bg-[#e06612] transition-colors"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">edit</span>
                </button>
            </div>

            {/* Cash in Hand */}
            <div className={`relative bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${selectedMetric && selectedMetric !== 'cashInHand' ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Cash In Hand
                        </h3>
                        <div className="flex items-baseline mt-1">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                {metrics.cashInHand?.value || "₹0.00"}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 md:p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-lg md:text-xl">
                            account_balance_wallet
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-xs md:text-sm">
                    {renderTrend(metrics.cashInHand?.trend, metrics.cashInHand?.trendDirection)}
                </div>
                <button
                    onClick={() => onEditClick('cashInHand', metrics.cashInHand?.value)}
                    className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1 md:p-1.5 bg-[#F97316] text-white rounded-md hover:bg-[#e06612] transition-colors"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">edit</span>
                </button>
            </div>

            {/* Outstanding Invoices */}
            <div className={`relative bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${selectedMetric && selectedMetric !== 'outstandingInvoices' ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Outstanding Invoices
                        </h3>
                        <div className="flex items-baseline mt-1">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                {metrics.outstandingInvoices?.value || "₹0.00"}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 md:p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-lg md:text-xl">
                            receipt_long
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {metrics.outstandingInvoices?.detail}
                </div>
                <button
                    onClick={() => onEditClick('outstandingInvoices', metrics.outstandingInvoices?.value)}
                    className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1 md:p-1.5 bg-[#F97316] text-white rounded-md hover:bg-[#e06612] transition-colors"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">edit</span>
                </button>
            </div>

            {/* Pending Bills */}
            <div className={`relative bg-white dark:bg-black p-3 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm ${selectedMetric && selectedMetric !== 'pendingBills' ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                            Pending Bills
                        </h3>
                        <div className="flex items-baseline mt-1">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                                {metrics.pendingBills?.value || "₹0.00"}
                            </span>
                        </div>
                    </div>
                    <div className="p-1.5 md:p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-lg md:text-xl">
                            payment
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    {metrics.pendingBills?.detail}
                </div>
                <button
                    onClick={() => onEditClick('pendingBills', metrics.pendingBills?.value)}
                    className="absolute bottom-2 right-2 md:bottom-3 md:right-3 p-1 md:p-1.5 bg-[#F97316] text-white rounded-md hover:bg-[#e06612] transition-colors"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">edit</span>
                </button>
            </div>
        </div>
    );
}
