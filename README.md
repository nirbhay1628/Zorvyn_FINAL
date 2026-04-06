# Zorvyn Finance Dashboard

A professional, feature-rich Finance Dashboard built with React, Tailwind CSS, and Recharts. Designed to meet the highest standards of fintech UI/UX with role-based access control, comprehensive analytics, and data persistence.

## Features ✨

### Core Features
- **Dashboard Overview**: Summary cards showing Total Balance, Income, and Expenses
- **Time-based Analytics**: Area chart displaying "Balance Over Time"
- **Categorical Analytics**: Interactive bar/donut chart for "Spending Breakdown"
- **Transactions Table**: Full-featured table with search, filter, and sorting
- **Insights & Analytics**: 
  - Highest Spending Category
  - Month-over-Month Growth calculation
  - Budget Alert (if expenses > 80% of income)

### Role-Based Access Control (RBAC)
- **Admin Mode**: Full access to Add, Edit, and Delete transactions
- **Viewer Mode**: Read-only access to all data
- Quick role toggle in the header

### Advanced Features
- **Dark Mode**: High-contrast dark theme with smooth transitions
- **Export Functionality**: Download transactions as CSV or JSON
- **Data Persistence**: LocalStorage integration for state persistence
- **Smooth Animations**: Framer Motion animations for cards and transitions
- **Mock Loading States**: Skeleton loaders showing realistic loading patterns
- **Responsive Design**: Mobile-first approach, works on all screen sizes

### Design System
- **Palette**: Professional Zorvyn colors (Slate, Deep Navy, Emerald)
- **Typography**: Inter font family for clean, professional look
- **Components**: Custom component library with Button, Input, Select, Badge, etc.
- **Borders**: Uses borders instead of shadows for a cleaner design
- **Empty States**: Proper empty state UI for no data scenarios

## Tech Stack

- **React 18.2**: Modern UI library
- **Zustand 4.4**: Lightweight state management with localStorage persistence
- **Tailwind CSS 3.3**: Utility-first CSS framework
- **Recharts 2.10**: Professional charting library
- **Lucide-React 0.292**: Modern icon library
- **Framer Motion 10.16**: Animation library
- **Date-fns 2.30**: Date utilities
- **Vite 5.0**: Next-generation bundler

## Installation

1. **Clone and navigate to the project**:
```bash
cd financial_dashboard
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

The dashboard will open automatically at `http://localhost:3000`

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
financial_dashboard/
├── src/
│   ├── components/
│   │   ├── Common.jsx              # Shared UI components
│   │   ├── DashboardOverview.jsx   # Summary cards
│   │   ├── Charts.jsx              # Recharts visualizations
│   │   ├── TransactionsTable.jsx   # Data table with sorting
│   │   ├── InsightsSection.jsx     # Analytics cards
│   │   ├── FilterPanel.jsx         # Filters & export
│   │   ├── Header.jsx              # Top navigation
│   │   └── AddTransactionModal.jsx # Add transaction form
│   ├── store/
│   │   └── financeStore.js         # Zustand store
│   ├── styles/
│   │   └── globals.css             # Global styles
│   ├── App.jsx                     # Main app component
│   └── main.jsx                    # Entry point
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Key Features Explained

### State Management
The Zustand store handles:
- Mock transactions array
- Current user role (Admin/Viewer)
- Global filters (Date range, Category, Search)
- Dark mode toggle
- Computed selectors for analytics

### Data Persistence
State is automatically synced to localStorage on every change, ensuring:
- Transactions persist across sessions
- User preferences (role, theme) are remembered
- Filters are maintained

### Charts & Analytics
- **Balance Over Time**: Tracks cumulative balance changes
- **Spending Breakdown**: Visualizes expenses by category
- Chart type toggle between bar and donut charts
- Responsive design adapts to screen size

### Role-Based Features
- Admin users see "Add Transaction", "Edit", and "Delete" buttons
- Viewer users see read-only interface
- Role switcher in header for testing both modes

### Search & Filter
- Real-time search across description and category
- Date range picker
- Category filter dropdown
- Sorting by Date or Amount with ascending/descending order
- Reset filters button

## Customization

### Dark Mode Colors
Edit `tailwind.config.js` under `extend.colors.zorvyn` to customize the color palette.

### Mock Data
Modify the `mockTransactions` array in `src/store/financeStore.js` to change sample data.

### Chart Colors
Update the `COLORS` array in `src/components/Charts.jsx` for different visualizations.

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)

## Performance Tips

- Skeleton loaders provide better perceived performance
- Memoized computed selectors in Zustand
- Framer Motion animations use GPU acceleration
- LocalStorage for instant data loading

## Future Enhancements

- Multi-user support with authentication
- Real API integration
- Budget goals and tracking
- Recurring transactions
- Investment portfolio tracking
- PDF report generation

## License

This project is created as part of the Zorvyn Finance Dashboard assignment.

---

**Built for Zorvyn** | Professional Finance Management Dashboard
"# Zorvyn_FINAL" 
