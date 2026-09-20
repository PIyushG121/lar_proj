"use client";
import React from "react";
import IncomeVsExpensesChart from "./IncomeVsExpensesChart";
import ExpenseStructurePieChart from "./ExpenseStructurePieChart";

interface ChartsSectionProps {
    chartData: any[];
    expenseData: any[];
    loading: boolean;
    colors: string[];
}

export default function ChartsSection({ chartData, expenseData, loading, colors }: ChartsSectionProps) {
    return (
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
            <IncomeVsExpensesChart data={chartData} loading={loading} />
            <ExpenseStructurePieChart data={expenseData} loading={loading} colors={colors} />
        </div>
    );
}
