import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { motion } from 'framer-motion';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'viewer', label: 'Viewer' },
];

const RoleDropdown = ({ value, onChange }) => {
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

  const selectedRole = roleOptions.find((option) => option.value === value) ?? roleOptions[0];

  return (
    <div ref={menuRef} className="relative min-w-[180px]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all hover:border-cyan-400/40 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-950/90 dark:text-white dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
      >
        <div>
          <div className="text-[13px] font-semibold text-slate-900 dark:text-white">{selectedRole.label}</div>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform dark:text-slate-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2.5 w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white p-1.5 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          {roleOptions.map((option) => {
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
                <span className="text-[14px] font-semibold">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  const currentRole = useFinanceStore((state) => state.currentRole);
  const setRole = useFinanceStore((state) => state.setRole);
  const darkMode = useFinanceStore((state) => state.darkMode);
  const toggleDarkMode = useFinanceStore((state) => state.toggleDarkMode);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="mb-0">
              <img
                src="/zorvynfulllogolight.png"
                alt="Zorvyn Finance"
                className="h-11 w-auto object-contain transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:drop-shadow-[0_10px_20px_rgba(15,23,42,0.18)] dark:hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <RoleDropdown value={currentRole} onChange={setRole} />
            </div>

            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all hover:border-cyan-400/40 hover:bg-slate-50 hover:text-slate-700 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)] dark:border-slate-700/70 dark:bg-slate-950/90 dark:text-slate-200 dark:shadow-[0_10px_30px_rgba(15,23,42,0.22)] dark:hover:bg-slate-900 dark:hover:text-white dark:hover:shadow-[0_14px_36px_rgba(15,23,42,0.28)]"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
