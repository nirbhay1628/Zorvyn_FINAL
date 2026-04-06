import React, { useState } from 'react';
import { Filter, X, Download } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { Button, Select } from './Common';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const FilterPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dateRange = useFinanceStore((state) => state.dateRange);
  const selectedCategory = useFinanceStore((state) => state.selectedCategory);
  const transactions = useFinanceStore((state) => state.transactions);

  const setDateRange = useFinanceStore((state) => state.setDateRange);
  const setSelectedCategory = useFinanceStore((state) => state.setSelectedCategory);
  const resetFilters = useFinanceStore((state) => state.resetFilters);
  const exportToCSV = useFinanceStore((state) => state.exportToCSV);
  const exportToJSON = useFinanceStore((state) => state.exportToJSON);

  const categories = [...new Set(transactions.map((t) => t.category))];

  const handleExport = (format) => {
    if (format === 'csv') {
      const csv = exportToCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${Date.now()}.csv`;
      a.click();
    } else if (format === 'json') {
      const json = exportToJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${Date.now()}.json`;
      a.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white font-medium"
        >
          <Filter className="w-4 h-4" />
          Filters {selectedCategory && <span className="ml-1 text-xs">({1})</span>}
        </button>

        <button
          onClick={() => handleExport('csv')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white font-medium"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>

        <button
          onClick={() => handleExport('json')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white font-medium"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>

      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={format(new Date(dateRange.start), 'yyyy-MM-dd')}
                onChange={(e) => setDateRange(new Date(e.target.value), dateRange.end)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={format(new Date(dateRange.end), 'yyyy-MM-dd')}
                onChange={(e) => setDateRange(dateRange.start, new Date(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <Select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map((cat) => ({ value: cat, label: cat })),
                ]}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              onClick={resetFilters}
              variant="secondary"
              className="flex-1"
            >
              Reset Filters
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="primary"
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
