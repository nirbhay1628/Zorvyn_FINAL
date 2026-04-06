import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Sector, Legend, LabelList } from 'recharts';
import { useFinanceStore } from '../store/financeStore';
import { SkeletonLoader, EmptyState } from './Common';
import { motion } from 'framer-motion';

const comparisonColors = {
  current: '#8B5CF6',
  previous: '#4F46E5',
};

const ChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 shadow-lg" style={{ backgroundColor: '#0f172a' }}>
        <p className="text-sm font-medium text-white">
          {payload[0].name}: ₹{payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const formatMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const formatMonthLabel = (date) => date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

const parseMonthKey = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1);
};

export const FullCategoryBreakdownChart = () => {
  const transactions = useFinanceStore((state) => state.transactions);

  const breakdown = useMemo(() => {
    const totals = new Map();

    transactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        totals.set(transaction.category, (totals.get(transaction.category) || 0) + transaction.amount);
      });

    const items = [...totals.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const grandTotal = items.reduce((sum, item) => sum + item.value, 0);

    return items.map((item, index) => ({
      ...item,
      percent: grandTotal ? Math.round((item.value / grandTotal) * 100) : 0,
      color: COLORS[index % COLORS.length],
    }));
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Full Category Breakdown</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Expense categories sorted from highest to lowest spend</p>
      </div>

      {breakdown.length === 0 ? (
        <EmptyState message="No expense categories available" />
      ) : (
        <div className="space-y-3">
          {breakdown.map((item, index) => (
            <div
              key={item.name}
              className="grid grid-cols-[28px_minmax(0,180px)_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-2xl px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{index + 1}</div>

              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.max(item.percent, 4)}%`,
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                    boxShadow: `0 0 12px ${item.color}55`,
                  }}
                />
              </div>

              <div className="w-24 text-right text-sm font-semibold text-slate-700 dark:text-slate-100">
                ₹{item.value.toLocaleString('en-IN')}
              </div>

              <div className="w-12 text-right text-sm text-slate-500 dark:text-slate-400">
                {item.percent}%
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const MonthlyComparisonChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const transactions = useFinanceStore((state) => state.transactions);
  const [leftMonth, setLeftMonth] = useState('');
  const [rightMonth, setRightMonth] = useState('');

  const monthOptions = useMemo(() => {
    const months = new Map();

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const monthKey = formatMonthKey(transactionDate);

      if (!months.has(monthKey)) {
        months.set(monthKey, {
          key: monthKey,
          label: formatMonthLabel(transactionDate),
          date: new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1),
        });
      }
    });

    return [...months.values()].sort((a, b) => a.date - b.date);
  }, [transactions]);

  useEffect(() => {
    if (monthOptions.length >= 2 && !leftMonth && !rightMonth) {
      const latest = monthOptions[monthOptions.length - 1];
      const previous = monthOptions[monthOptions.length - 2];
      setLeftMonth(previous.key);
      setRightMonth(latest.key);
    } else if (monthOptions.length === 1 && !leftMonth && !rightMonth) {
      setLeftMonth(monthOptions[0].key);
      setRightMonth(monthOptions[0].key);
    }
  }, [monthOptions, leftMonth, rightMonth]);

  const comparison = useMemo(() => {
    const selectedMonths = [leftMonth, rightMonth].filter(Boolean);

    if (selectedMonths.length === 0) {
      return { labels: { previous: '', current: '' }, data: [] };
    }

    const getTotalsForMonth = (monthKey) => {
      const monthDate = parseMonthKey(monthKey);

      const monthTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === monthDate.getMonth() && transactionDate.getFullYear() === monthDate.getFullYear();
      });

      return {
        income: monthTransactions.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0),
        expense: monthTransactions.filter((transaction) => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0),
      };
    };

    const leftDate = leftMonth ? parseMonthKey(leftMonth) : null;
    const rightDate = rightMonth ? parseMonthKey(rightMonth) : null;
    const leftTotals = leftMonth ? getTotalsForMonth(leftMonth) : { income: 0, expense: 0 };
    const rightTotals = rightMonth ? getTotalsForMonth(rightMonth) : { income: 0, expense: 0 };

    return {
      labels: {
        previous: leftDate ? formatMonthLabel(leftDate) : '',
        current: rightDate ? formatMonthLabel(rightDate) : '',
      },
      data: [
        { name: 'Income', previous: leftTotals.income, current: rightTotals.income },
        { name: 'Expense', previous: leftTotals.expense, current: rightTotals.expense },
      ],
    };
  }, [transactions, leftMonth, rightMonth]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Comparison</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Compare any two months from the dataset
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end lg:min-w-[520px]">
          <div>
            <select
              value={leftMonth}
              onChange={(e) => setLeftMonth(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-200/70 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/40 dark:border-white/10 dark:bg-[#162038] dark:text-white dark:shadow-black/10"
            >
              {monthOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center px-1 text-sm font-semibold text-slate-500 dark:text-slate-400 sm:pb-3">
            and
          </div>

          <div>
            <select
              value={rightMonth}
              onChange={(e) => setRightMonth(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-200/70 outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/40 dark:border-white/10 dark:bg-[#162038] dark:text-white dark:shadow-black/10"
            >
              {monthOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader count={1} height="h-80" />
      ) : comparison.data.length === 0 ? (
        <EmptyState message="No comparison data available" />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={comparison.data} barCategoryGap="28%" barGap={8} margin={{ top: 10, right: 12, left: 0, bottom: 18 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:stroke-slate-700" />
            <XAxis dataKey="name" stroke="#64748b" className="dark:stroke-slate-400" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis stroke="#64748b" className="dark:stroke-slate-400" tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '12px' }} />
            <Bar dataKey="previous" name={comparison.labels.previous} fill={comparisonColors.previous} radius={[8, 8, 0, 0]} maxBarSize={56}>
              <LabelList dataKey="previous" position="top" formatter={(value) => `₹${Number(value || 0).toFixed(0)}`} fill="#64748b" />
            </Bar>
            <Bar dataKey="current" name={comparison.labels.current} fill={comparisonColors.current} radius={[8, 8, 0, 0]} maxBarSize={56}>
              <LabelList dataKey="current" position="top" formatter={(value) => `₹${Number(value || 0).toFixed(0)}`} fill="#64748b" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export const BalanceOverTimeChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const getBalanceOverTime = useFinanceStore((state) => state.getBalanceOverTime);
  const data = getBalanceOverTime();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Balance Over Time</h3>
      {isLoading ? (
        <SkeletonLoader count={1} height="h-80" />
      ) : data.length === 0 ? (
        <EmptyState message="No data available" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:stroke-slate-700" />
            <XAxis dataKey="date" stroke="#64748b" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const GlowBar = ({ x, y, width, height, fill, index, activeIndex }) => {
  const isActive = index === activeIndex;

  return (
    <g>
      {isActive && (
        <rect
          x={x - 4}
          y={y - 4}
          width={width + 8}
          height={height + 8}
          rx={10}
          ry={10}
          fill={fill}
          opacity={0.22}
          filter="blur(10px)"
        />
      )}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        ry={8}
        fill={fill}
        style={{
          transformOrigin: 'center bottom',
          transform: isActive ? 'translateY(-2px) scale(1.02)' : 'none',
          transition: 'all 180ms ease',
        }}
      />
    </g>
  );
};

const GlowPieSlice = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.24}
        style={{ filter: 'blur(8px)' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 1}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          transform: 'translateY(-2px)',
          transformOrigin: 'center',
          transition: 'all 180ms ease',
          filter: `drop-shadow(0 0 14px ${fill}cc)`,
        }}
      />
    </g>
  );
};

const RenderActivePieShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.18}
        style={{ filter: 'blur(10px)' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="rgba(255,255,255,0.9)"
        strokeWidth={2}
        style={{
          transform: 'translateY(-2px)',
          transformOrigin: 'center',
          transition: 'all 180ms ease',
          filter: `drop-shadow(0 0 16px ${fill}cc)`,
        }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#0f172a" className="dark:fill-white" style={{ fontSize: '18px', fontWeight: 700 }}>
        {payload?.name}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fill="#64748b" className="dark:fill-slate-300" style={{ fontSize: '13px', fontWeight: 500 }}>
        ₹{value?.toFixed(0)} • {(percent * 100).toFixed(0)}%
      </text>
    </g>
  );
};

const chartTypeOptions = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'donut', label: 'Donut Chart' },
];

const ChartTypeDropdown = ({ value, onChange }) => {
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

  const selectedOption = chartTypeOptions.find((option) => option.value === value) ?? chartTypeOptions[0];

  return (
    <div ref={menuRef} className="relative min-w-[150px]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:border-emerald-400/60 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-950/90 dark:text-white dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)] dark:hover:border-cyan-400/40 dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
      >
        <div>
          <div className="text-[13px] font-semibold text-slate-900 dark:text-white">{selectedOption.label}</div>
        </div>
        <svg
          className={`h-3.5 w-3.5 text-slate-500 transition-transform dark:text-slate-300 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-2.5 w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white p-1.5 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          {chartTypeOptions.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full flex-col items-start rounded-2xl px-3 py-2 text-left transition-all duration-200 ${
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

export const SpendingBreakdownChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const [activeIndex, setActiveIndex] = useState(null);
  const [activePieIndex, setActivePieIndex] = useState(0);
  const getSpendingByCategory = useFinanceStore((state) => state.getSpendingByCategory);
  const data = getSpendingByCategory();
  const activePieItem = data[activePieIndex] ?? data[0];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Spending Breakdown</h3>
        <ChartTypeDropdown value={chartType} onChange={setChartType} />
      </div>

      {isLoading ? (
        <SkeletonLoader count={1} height="h-80" />
      ) : data.length === 0 ? (
        <EmptyState message="No spending data available" />
      ) : chartType === 'bar' ? (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} onMouseLeave={() => setActiveIndex(null)} margin={{ top: 10, right: 10, left: 0, bottom: 35 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:stroke-slate-700" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              className="dark:stroke-slate-400"
              tick={{ fontSize: 11, fill: '#64748b' }}
              angle={-18}
              textAnchor="end"
              height={58}
              interval={0}
              tickMargin={14}
            />
            <YAxis stroke="#64748b" className="dark:stroke-slate-400" style={{ fontSize: '12px' }} />
            <Tooltip content={<ChartTooltip />} cursor={false} />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              shape={(props) => <GlowBar {...props} activeIndex={activeIndex} />}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ transition: 'filter 180ms ease' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="space-y-5">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart onMouseLeave={() => setActivePieIndex(0)}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={78}
                outerRadius={126}
                fill="#8884d8"
                dataKey="value"
                activeIndex={activePieIndex}
                activeShape={RenderActivePieShape}
                onMouseEnter={(_, index) => setActivePieIndex(index)}
                onClick={(_, index) => setActivePieIndex(index)}
                onMouseLeave={() => setActivePieIndex(0)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} cursor={false} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {data.map((entry, index) => {
              const isActive = index === activePieIndex;

              return (
                <button
                  key={entry.name}
                  type="button"
                  onClick={() => setActivePieIndex(index)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'border-slate-300 bg-slate-100 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </button>
              );
            })}
          </div>
          {activePieItem && (
            <div className="flex items-center justify-center">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                Active slice: <span className="font-semibold text-slate-900 dark:text-white">{activePieItem.name}</span> • ₹{activePieItem.value.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
