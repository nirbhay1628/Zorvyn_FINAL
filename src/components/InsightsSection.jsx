import React from 'react';
import { TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { motion } from 'framer-motion';

export const InsightsSection = () => {
  const getHighestSpendingCategory = useFinanceStore((state) => state.getHighestSpendingCategory);
  const getMonthlyGrowth = useFinanceStore((state) => state.getMonthlyGrowth);
  const getBudgetStatus = useFinanceStore((state) => state.getBudgetStatus);

  const highestCategory = getHighestSpendingCategory();
  const monthlyGrowth = getMonthlyGrowth();
  const budgetStatus = getBudgetStatus();

  const InsightCard = ({ title, value, subtitle, icon: Icon, color, alert = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-6 rounded-lg border ${
        alert 
          ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' 
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
      }`}
      style={{
        boxShadow: alert
          ? 'none'
          : '0 0 0 1px rgba(148, 163, 184, 0.12)',
      }}
      whileHover={{
        y: -4,
        scale: 1.01,
        boxShadow: alert
          ? '0 0 0 1px rgba(239, 68, 68, 0.22), 0 10px 30px rgba(239, 68, 68, 0.16)'
          : color === 'emerald'
            ? '0 0 0 1px rgba(16, 185, 129, 0.22), 0 10px 30px rgba(16, 185, 129, 0.16)'
            : color === 'blue'
              ? '0 0 0 1px rgba(59, 130, 246, 0.22), 0 10px 30px rgba(59, 130, 246, 0.16)'
              : '0 0 0 1px rgba(239, 68, 68, 0.22), 0 10px 30px rgba(239, 68, 68, 0.16)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400">{title}</h4>
        <div className={`p-2 rounded-lg ${
          color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
          color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
          'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{value}</p>
      <p className="text-xs text-slate-600 dark:text-slate-400">{subtitle}</p>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Insights & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highestCategory && (
          <InsightCard
            title="Highest Spending Category"
            value={highestCategory.name}
            subtitle={`₹${highestCategory.value.toFixed(2)} spent this month`}
            icon={Zap}
            color="blue"
          />
        )}

        <InsightCard
          title="Month-over-Month Growth"
          value={`${monthlyGrowth > 0 ? '+' : ''}${monthlyGrowth}%`}
          subtitle={monthlyGrowth > 0 ? 'Income increased' : 'Income decreased'}
          icon={TrendingUp}
          color={monthlyGrowth > 0 ? 'emerald' : 'red'}
        />

        <InsightCard
          title="Budget Status"
          value={`${budgetStatus.percentage}%`}
          subtitle={budgetStatus.isAlerted ? '⚠️ Above 80% threshold!' : 'Expenses under control'}
          icon={AlertCircle}
          color={budgetStatus.isAlerted ? 'red' : 'emerald'}
          alert={budgetStatus.isAlerted}
        />
      </div>
    </div>
  );
};
