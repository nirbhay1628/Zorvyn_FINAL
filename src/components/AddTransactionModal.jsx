import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { Button, Input, Select } from './Common';
import { motion } from 'framer-motion';

const typeOptions = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

export const AddTransactionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Groceries',
    type: 'expense',
    description: '',
  });

  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const transactions = useFinanceStore((state) => state.transactions);

  const categories = [...new Set(transactions.map((t) => t.category))];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.description) {
      addTransaction({
        date: new Date(formData.date),
        amount: formData.amount,
        category: formData.category,
        type: formData.type,
        description: formData.description,
      });
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: 'Groceries',
        type: 'expense',
        description: '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-[0_28px_80px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 dark:border-white/10">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Add Transaction</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close add transaction modal"
            className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-white/10 dark:bg-[#11192d]">
              {typeOptions.map((option) => {
                const active = formData.type === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: option.value }))}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                      active
                        ? option.value === 'expense'
                          ? 'bg-rose-600 text-white shadow-[0_12px_24px_rgba(244,63,94,0.24)]'
                          : 'bg-emerald-600 text-white shadow-[0_12px_24px_rgba(16,185,129,0.24)]'
                        : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Description
            </label>
            <Input
              type="text"
              name="description"
              placeholder="e.g. Monthly Salary"
              value={formData.description}
              onChange={handleChange}
              className="border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/40 dark:border-white/10 dark:bg-[#11192d] dark:text-white dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Amount (₹)
            </label>
            <Input
              type="number"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="border-slate-200 bg-white text-slate-900 placeholder-slate-400 shadow-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/40 dark:border-white/10 dark:bg-[#11192d] dark:text-white dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/40 dark:border-white/10 dark:bg-[#11192d] dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Category
            </label>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories.map((cat) => ({ value: cat, label: cat }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-none outline-none focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/40 dark:border-white/10 dark:bg-[#11192d] dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="secondary" className="flex-1 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1 rounded-xl bg-emerald-600 py-2.5 hover:bg-emerald-700">
              Add Transaction
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
