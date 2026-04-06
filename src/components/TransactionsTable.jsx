import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Trash2, Edit2, ArrowUpDown, Filter, Download, ChevronDown, Plus } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { Badge, Input, EmptyState, SkeletonLoader } from './Common';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const categoryStyles = {
  Salary: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Freelance: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  Consulting: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  Groceries: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  Entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  Utilities: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  Dining: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Transport: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  Shopping: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
  Health: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  Gift: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const categoryDotStyles = {
  Salary: 'bg-emerald-500',
  Freelance: 'bg-indigo-500',
  Consulting: 'bg-violet-500',
  Groceries: 'bg-amber-500',
  Entertainment: 'bg-pink-500',
  Utilities: 'bg-slate-500',
  Dining: 'bg-orange-500',
  Transport: 'bg-cyan-500',
  Shopping: 'bg-fuchsia-500',
  Health: 'bg-rose-500',
  Gift: 'bg-purple-500',
};

const getCategoryClass = (category) => categoryStyles[category] || 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
const getCategoryDot = (category) => categoryDotStyles[category] || 'bg-blue-500';

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

const DropdownField = ({ value, options, onChange, placeholder, minWidthClass = 'min-w-0' }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div ref={menuRef} className={`relative ${minWidthClass}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all hover:border-cyan-400/40 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-950/90 dark:text-white dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)] dark:hover:border-cyan-400/40 dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
      >
        <div className="min-w-0 text-left">
          <div className="truncate text-[13px] font-semibold text-slate-900 dark:text-white">{selectedOption?.label ?? placeholder}</div>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform dark:text-slate-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2.5 w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white p-1.5 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full flex-col items-start rounded-2xl px-3.5 py-2.5 text-left transition-all duration-200 ${
                  active
                    ? 'bg-slate-100 text-slate-900 shadow-[0_0_0_1px_rgba(148,163,184,0.18)] dark:bg-white/10 dark:text-white dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
              >
                <span className="text-[13px] font-semibold">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const TransactionsTable = ({ onAddTransaction }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');

  const currentRole = useFinanceStore((state) => state.currentRole);
  const searchQuery = useFinanceStore((state) => state.searchQuery);
  const setSearchQuery = useFinanceStore((state) => state.setSearchQuery);
  const dateRange = useFinanceStore((state) => state.dateRange);
  const selectedCategory = useFinanceStore((state) => state.selectedCategory);
  const setDateRange = useFinanceStore((state) => state.setDateRange);
  const setSelectedCategory = useFinanceStore((state) => state.setSelectedCategory);
  const resetFilters = useFinanceStore((state) => state.resetFilters);
  const getFilteredTransactions = useFinanceStore((state) => state.getFilteredTransactions);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);
  const exportToCSV = useFinanceStore((state) => state.exportToCSV);
  const exportToJSON = useFinanceStore((state) => state.exportToJSON);
  const transactions = useFinanceStore((state) => state.transactions);

  const categories = useMemo(() => [...new Set(transactions.map((transaction) => transaction.category))].sort(), [transactions]);
  const filtered = getFilteredTransactions();
  const filteredByType = useMemo(
    () => filtered.filter((transaction) => selectedType === 'all' || transaction.type === selectedType),
    [filtered, selectedType]
  );

  const sorted = useMemo(() => {
    const copy = [...filteredByType];
    copy.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return copy;
  }, [filteredByType, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleExport = (formatType) => {
    const isJson = formatType === 'json';
    const content = isJson ? exportToJSON() : exportToCSV();
    const blob = new Blob([content], { type: isJson ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${Date.now()}.${isJson ? 'json' : 'csv'}`;
    a.click();
  };

  const handleSortToggle = () => {
    setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
  };

  const SortHeader = ({ label, field }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
    >
      <div className="flex items-center gap-2">
        {label}
        {sortBy === field && (
          <ArrowUpDown className="w-4 h-4" />
        )}
      </div>
    </th>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-950 dark:text-white dark:shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
    >
      <div className="border-b border-slate-200 bg-white px-6 py-5 text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Transactions</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sorted.length} records found</p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => handleExport('csv')}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:hover:border-white/20 dark:hover:bg-slate-900"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={() => handleExport('json')}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:hover:border-white/20 dark:hover:bg-slate-900"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>

            {onAddTransaction && (
              <button
                type="button"
                onClick={onAddTransaction}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[#11192d] dark:shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full flex-1 min-w-0 lg:max-w-4xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
              <Input
                placeholder="Search by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-slate-200 bg-white pl-10 text-slate-900 placeholder-slate-400 shadow-none focus:ring-2 focus:ring-fuchsia-500 dark:border-white/10 dark:bg-[#162038] dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end lg:ml-auto lg:self-auto">
              <button
                type="button"
                onClick={() => setIsFilterOpen((current) => !current)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                  isFilterOpen
                    ? 'border border-emerald-500 bg-emerald-600 text-white shadow-[0_14px_30px_rgba(16,185,129,0.28)] hover:bg-emerald-700'
                    : 'border border-slate-200 bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:border-emerald-400/50 hover:bg-slate-50 hover:text-slate-900 hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)] dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-200 dark:shadow-[0_10px_24px_rgba(0,0,0,0.22)] dark:hover:bg-slate-900 dark:hover:text-white'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleSortToggle}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all hover:border-emerald-400/50 hover:bg-slate-50 hover:text-slate-900 hover:shadow-[0_14px_30px_rgba(15,23,42,0.1)] dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-200 dark:shadow-[0_10px_24px_rgba(0,0,0,0.22)] dark:hover:bg-slate-900 dark:hover:text-white"
                aria-label={sortOrder === 'asc' ? 'Switch to descending' : 'Switch to ascending'}
              >
                <ArrowUpDown className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {isFilterOpen && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[#0f172a] dark:shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Type
                  </label>
                  <DropdownField
                    value={selectedType}
                    options={typeOptions}
                    onChange={setSelectedType}
                    placeholder="All Types"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Category
                  </label>
                  <DropdownField
                    value={selectedCategory || ''}
                    options={[{ value: '', label: 'All Categories' }, ...categories.map((category) => ({ value: category, label: category }))]}
                    onChange={(nextCategory) => setSelectedCategory(nextCategory || null)}
                    placeholder="All Categories"
                    minWidthClass="min-w-0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={format(new Date(dateRange.start), 'yyyy-MM-dd')}
                    onChange={(e) => setDateRange(new Date(e.target.value), dateRange.end)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-200/70 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/40 dark:border-white/10 dark:bg-[#162038] dark:text-white dark:shadow-black/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={format(new Date(dateRange.end), 'yyyy-MM-dd')}
                    onChange={(e) => setDateRange(dateRange.start, new Date(e.target.value))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-200/70 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/40 dark:border-white/10 dark:bg-[#162038] dark:text-white dark:shadow-black/10"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-white/8">
                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    setSelectedType('all');
                  }}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-emerald-400/50 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  Reset Filters
                </button>

                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-h-[620px] overflow-auto">
        {isLoading ? (
          <div className="p-6">
            <SkeletonLoader count={5} height="h-10" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-6">
            <EmptyState message="No transactions found" />
          </div>
        ) : (
          <table className="w-full min-w-[980px]">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
              <tr>
                <SortHeader label="Date" field="date" />
                <SortHeader label="Amount" field="amount" />
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Description
                </th>
                {currentRole === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-950">
              {sorted.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-l-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                    transaction.type === 'income'
                      ? 'border-l-emerald-500'
                      : 'border-l-rose-500'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getCategoryClass(transaction.category)}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${getCategoryDot(transaction.category)}`} />
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge
                      label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      variant={transaction.type === 'income' ? 'income' : 'expense'}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {transaction.description}
                  </td>
                  {currentRole === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};
