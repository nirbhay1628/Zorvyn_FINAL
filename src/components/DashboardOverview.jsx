import React, { useEffect, useState } from 'react';
import { IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { SummaryCard, SkeletonLoader } from './Common';
import { motion } from 'framer-motion';

export const DashboardOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const getTotalBalance = useFinanceStore((state) => state.getTotalBalance);
  const getTotalIncome = useFinanceStore((state) => state.getTotalIncome);
  const getTotalExpenses = useFinanceStore((state) => state.getTotalExpenses);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <SkeletonLoader count={2} height="h-6" />
          </div>
        ))}
      </div>
    );
  }

  const balance = getTotalBalance();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();

  const incomeGrowth = income > 0 ? '+12.5%' : '0%';
  const expenseGrowth = expenses > 0 ? '-5.2%' : '0%';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="Total Balance"
        value={`₹${balance.toFixed(2)}`}
        icon={IndianRupee}
        color="slate"
        trend={{ positive: true, label: 'vs last month' }}
      />
      <SummaryCard
        title="Total Income"
        value={`₹${income.toFixed(2)}`}
        icon={TrendingUp}
        color="emerald"
        trend={{ positive: true, label: incomeGrowth }}
      />
      <SummaryCard
        title="Total Expenses"
        value={`₹${expenses.toFixed(2)}`}
        icon={TrendingDown}
        color="red"
        trend={{ positive: false, label: expenseGrowth }}
      />
    </div>
  );
};
