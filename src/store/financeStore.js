import { create } from 'zustand';
import { addDays, subDays, format, parse } from 'date-fns';

const mockTransactions = [
  {
    id: 1,
    date: subDays(new Date(), 15),
    amount: 2500,
    category: 'Salary',
    type: 'income',
    description: 'Monthly Salary'
  },
  {
    id: 2,
    date: subDays(new Date(), 14),
    amount: 1200,
    category: 'Groceries',
    type: 'expense',
    description: 'Weekly shopping'
  },
  {
    id: 3,
    date: subDays(new Date(), 12),
    amount: 80,
    category: 'Entertainment',
    type: 'expense',
    description: 'Movie tickets'
  },
  {
    id: 4,
    date: subDays(new Date(), 10),
    amount: 500,
    category: 'Utilities',
    type: 'expense',
    description: 'Electric bill'
  },
  {
    id: 5,
    date: subDays(new Date(), 8),
    amount: 1500,
    category: 'Freelance',
    type: 'income',
    description: 'Project payment'
  },
  {
    id: 6,
    date: subDays(new Date(), 6),
    amount: 300,
    category: 'Dining',
    type: 'expense',
    description: 'Restaurant'
  },
  {
    id: 7,
    date: subDays(new Date(), 4),
    amount: 150,
    category: 'Transport',
    type: 'expense',
    description: 'Gas'
  },
  {
    id: 8,
    date: subDays(new Date(), 2),
    amount: 75,
    category: 'Entertainment',
    type: 'expense',
    description: 'Gaming'
  },
  {
    id: 9,
    date: new Date(),
    amount: 2500,
    category: 'Salary',
    type: 'income',
    description: 'Monthly Salary'
  },
  {
    id: 10,
    date: subDays(new Date(), 1),
    amount: 420,
    category: 'Dining',
    type: 'expense',
    description: 'Weekend brunch'
  },
  {
    id: 11,
    date: subDays(new Date(), 3),
    amount: 980,
    category: 'Transport',
    type: 'expense',
    description: 'Cab rides and commute'
  },
  {
    id: 12,
    date: subDays(new Date(), 5),
    amount: 2200,
    category: 'Consulting',
    type: 'income',
    description: 'Client consultation fee'
  },
  {
    id: 13,
    date: subDays(new Date(), 7),
    amount: 640,
    category: 'Shopping',
    type: 'expense',
    description: 'Office accessories'
  },
  {
    id: 14,
    date: subDays(new Date(), 9),
    amount: 180,
    category: 'Health',
    type: 'expense',
    description: 'Pharmacy essentials'
  },
  {
    id: 15,
    date: subDays(new Date(), 11),
    amount: 900,
    category: 'Freelance',
    type: 'income',
    description: 'Landing page revision'
  },
  {
    id: 16,
    date: subDays(new Date(), 13),
    amount: 260,
    category: 'Utilities',
    type: 'expense',
    description: 'Water bill'
  },
  {
    id: 17,
    date: subDays(new Date(), 16),
    amount: 150,
    category: 'Entertainment',
    type: 'expense',
    description: 'Streaming subscription'
  },
  {
    id: 18,
    date: subDays(new Date(), 18),
    amount: 750,
    category: 'Gift',
    type: 'expense',
    description: 'Birthday gift'
  },
  {
    id: 19,
    date: subDays(new Date(), 19),
    amount: 1800,
    category: 'Consulting',
    type: 'income',
    description: 'Strategy workshop'
  },
  {
    id: 20,
    date: subDays(new Date(), 17),
    amount: 950,
    category: 'Shopping',
    type: 'expense',
    description: 'Equipment upgrade'
  },
  {
    id: 21,
    date: subDays(new Date(), 16),
    amount: 600,
    category: 'Utilities',
    type: 'expense',
    description: 'Internet bill'
  },
  {
    id: 22,
    date: subDays(new Date(), 13),
    amount: 2600,
    category: 'Freelance',
    type: 'income',
    description: 'Branding project payment'
  },
  {
    id: 23,
    date: subDays(new Date(), 9),
    amount: 1100,
    category: 'Dining',
    type: 'expense',
    description: 'Team dinner'
  },
  {
    id: 24,
    date: subDays(new Date(), 7),
    amount: 2100,
    category: 'Salary',
    type: 'income',
    description: 'Part-time salary'
  },
  {
    id: 25,
    date: subDays(new Date(), 5),
    amount: 720,
    category: 'Transport',
    type: 'expense',
    description: 'Client visits'
  },
  {
    id: 26,
    date: subDays(new Date(), 4),
    amount: 1400,
    category: 'Consulting',
    type: 'income',
    description: 'Monthly advisory fee'
  },
  {
    id: 27,
    date: subDays(new Date(), 3),
    amount: 360,
    category: 'Health',
    type: 'expense',
    description: 'Medicines and checkup'
  },
  {
    id: 28,
    date: subDays(new Date(), 2),
    amount: 2400,
    category: 'Freelance',
    type: 'income',
    description: 'UI design milestone'
  },
  {
    id: 29,
    date: subDays(new Date(), 1),
    amount: 680,
    category: 'Groceries',
    type: 'expense',
    description: 'Weekly essentials'
  },
  {
    id: 30,
    date: new Date(),
    amount: 3200,
    category: 'Salary',
    type: 'income',
    description: 'Monthly salary bonus'
  },
];

const createStore = (set, get) => ({
  // State
  transactions: mockTransactions,
  currentRole: 'admin',
  dateRange: {
    start: subDays(new Date(), 30),
    end: new Date(),
  },
  selectedCategory: null,
  searchQuery: '',
  darkMode: false,
  isLoading: false,

  // Actions
  addTransaction: (transaction) => set((state) => ({
    transactions: [
      ...state.transactions,
      {
        ...transaction,
        id: Math.max(...state.transactions.map(t => t.id), 0) + 1,
      }
    ]
  })),

  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t.id !== id)
  })),

  setRole: (role) => set({ currentRole: role }),

  setDateRange: (start, end) => set((state) => ({
    dateRange: { start, end }
  })),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleDarkMode: () => set((state) => ({
    darkMode: !state.darkMode
  })),

  setLoading: (loading) => set({ isLoading: loading }),

  // Selectors/Computed
  getFilteredTransactions: () => {
    const state = get();
    return state.transactions.filter((transaction) => {
      const transDate = new Date(transaction.date);
      const inDateRange = transDate >= state.dateRange.start && transDate <= state.dateRange.end;
      const matchesCategory = !state.selectedCategory || transaction.category === state.selectedCategory;
      const matchesSearch = !state.searchQuery ||
        transaction.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(state.searchQuery.toLowerCase());

      return inDateRange && matchesCategory && matchesSearch;
    });
  },

  getTotalBalance: () => {
    const state = get();
    return state.transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
  },

  getTotalIncome: () => {
    const state = get();
    return state.transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  },

  getTotalExpenses: () => {
    const state = get();
    return state.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  },

  getSpendingByCategory: () => {
    const state = get();
    const filtered = get().getFilteredTransactions();
    const breakdown = {};

    filtered
      .filter(t => t.type === 'expense')
      .forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
      });

    return Object.entries(breakdown).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  },

  getBalanceOverTime: () => {
    const state = get();
    const sorted = [...state.transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const balanceData = [];
    let runningBalance = 0;

    sorted.forEach(t => {
      runningBalance += t.type === 'income' ? t.amount : -t.amount;
      balanceData.push({
        date: format(new Date(t.date), 'MMM dd'),
        balance: runningBalance,
      });
    });

    return balanceData;
  },

  getHighestSpendingCategory: () => {
    const breakdown = get().getSpendingByCategory();
    return breakdown.length ? breakdown.reduce((prev, current) => 
      current.value > prev.value ? current : prev
    ) : null;
  },

  getMonthlyGrowth: () => {
    const state = get();
    const currentMonth = state.transactions.filter(t => {
      const tDate = new Date(t.date);
      const now = new Date();
      return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    });

    const lastMonth = state.transactions.filter(t => {
      const tDate = new Date(t.date);
      const now = new Date();
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return tDate.getMonth() === lastMonthDate.getMonth() && tDate.getFullYear() === lastMonthDate.getFullYear();
    });

    const currentIncome = currentMonth
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const lastIncome = lastMonth
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    if (lastIncome === 0) return 0;
    return Math.round(((currentIncome - lastIncome) / lastIncome) * 100);
  },

  getMonthlyComparison: () => {
    const state = get();
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonthDate = new Date(currentYear, currentMonthIndex - 1, 1);
    const previousMonthIndex = previousMonthDate.getMonth();
    const previousYear = previousMonthDate.getFullYear();

    const currentMonthTransactions = state.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonthIndex && transactionDate.getFullYear() === currentYear;
    });

    const previousMonthTransactions = state.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === previousMonthIndex && transactionDate.getFullYear() === previousYear;
    });

    const getTotals = (transactions) => ({
      income: transactions.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0),
      expense: transactions.filter((transaction) => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0),
    });

    const currentTotals = getTotals(currentMonthTransactions);
    const previousTotals = getTotals(previousMonthTransactions);

    return {
      labels: {
        current: format(now, 'MMMM yyyy'),
        previous: format(previousMonthDate, 'MMMM yyyy'),
      },
      data: [
        { name: 'Income', [format(now, 'MMM yyyy')]: currentTotals.income, [format(previousMonthDate, 'MMM yyyy')]: previousTotals.income },
        { name: 'Expense', [format(now, 'MMM yyyy')]: currentTotals.expense, [format(previousMonthDate, 'MMM yyyy')]: previousTotals.expense },
      ],
    };
  },

  getBudgetStatus: () => {
    const state = get();
    const income = get().getTotalIncome();
    const expenses = get().getTotalExpenses();
    const percentage = income > 0 ? (expenses / income) * 100 : 0;
    return {
      percentage: Math.round(percentage),
      isAlerted: percentage > 80,
    };
  },

  resetFilters: () => set((state) => ({
    dateRange: {
      start: subDays(new Date(), 30),
      end: new Date(),
    },
    selectedCategory: null,
    searchQuery: '',
  })),

  exportToCSV: () => {
    const state = get();
    const filtered = state.getFilteredTransactions();
    const headers = ['Date', 'Amount', 'Category', 'Type', 'Description'];
    const rows = filtered.map(t => [
      format(new Date(t.date), 'yyyy-MM-dd'),
      t.amount,
      t.category,
      t.type,
      t.description,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csv;
  },

  exportToJSON: () => {
    const state = get();
    return JSON.stringify(state.getFilteredTransactions(), null, 2);
  },
});

export const useFinanceStore = create((set, get) => {
  // Load from localStorage if available
  const savedState = localStorage.getItem('financeStore');
  const initialState = savedState ? JSON.parse(savedState) : null;

  const store = createStore(set, get);

  const mergeTransactions = (persistedTransactions = [], seedTransactions = []) => {
    const merged = [...persistedTransactions];
    const existingIds = new Set(persistedTransactions.map((transaction) => transaction.id));

    seedTransactions.forEach((transaction) => {
      if (!existingIds.has(transaction.id)) {
        merged.push(transaction);
      }
    });

    return merged;
  };

  // Set initial state from localStorage if available
  if (initialState) {
    set({
      ...initialState,
      transactions: mergeTransactions(initialState.transactions, mockTransactions),
    });
  }

  return store;
});

// Manually subscribe after creation
setTimeout(() => {
  const savedState = localStorage.getItem('financeStore');
  if (savedState) {
    const parsed = JSON.parse(savedState);
    useFinanceStore.setState({
      transactions: parsed.transactions || mockTransactions,
      currentRole: parsed.currentRole || 'admin',
      darkMode: parsed.darkMode || false,
    });
  }
}, 0);
