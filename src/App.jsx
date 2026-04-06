import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { BalanceOverTimeChart, FullCategoryBreakdownChart, MonthlyComparisonChart, SpendingBreakdownChart } from './components/Charts';
import { TransactionsTable } from './components/TransactionsTable';
import { InsightsSection } from './components/InsightsSection';
import { AddTransactionModal } from './components/AddTransactionModal';
import { useFinanceStore } from './store/financeStore';

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const darkMode = useFinanceStore((state) => state.darkMode);
  const currentRole = useFinanceStore((state) => state.currentRole);
  const todayLabel = format(new Date(), 'EEEE, MMMM d');
  const roleLabel = currentRole === 'admin' ? 'Admin' : 'Viewer';
  const roleSubLabel = currentRole === 'admin' ? 'Manage ready' : 'Data only';

  useEffect(() => {
    if (currentRole !== 'admin') {
      setIsAddModalOpen(false);
    }
  }, [currentRole]);

  useEffect(() => {
    // Apply dark mode to HTML root
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex min-h-screen flex-col overflow-hidden bg-transparent text-slate-900 transition-colors dark:text-white">
        <Header />

        <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/90 px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{todayLabel}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Welcome back, NiC.
              </h1>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  NiC
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">NiC</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">Zorvyn fintech</p>
                </div>
              </div>

              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-slate-700 dark:bg-slate-950">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{roleLabel}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{roleSubLabel}</p>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Dashboard Overview */}
            <DashboardOverview />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BalanceOverTimeChart />
              <SpendingBreakdownChart />
            </div>

            <MonthlyComparisonChart />

            <FullCategoryBreakdownChart />

            {/* Insights */}
            <InsightsSection />

            {/* Transactions Table */}
            <TransactionsTable
              onAddTransaction={currentRole === 'admin' ? () => setIsAddModalOpen(true) : undefined}
            />
          </div>
          </div>
        </main>

        {/* Add Transaction Modal */}
        {currentRole === 'admin' && (
          <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        )}

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950/50 py-6 mt-12 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-300">
              Made with ❤️ by Nirbhay Chaudhary
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
