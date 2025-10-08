import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TransactionProvider } from './contexts/TransactionContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import BudgetGoals from './components/BudgetGoals';
import Analytics from './components/Analytics';
import ExportData from './components/ExportData';
import { Plus, LogOut, BarChart3, List, Target, Lightbulb, Download } from 'lucide-react';

type Page = 'landing' | 'login' | 'register';
type Tab = 'dashboard' | 'transactions' | 'goals' | 'analytics' | 'export';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (!user) {
    if (currentPage === 'login') {
      return <Login onSwitchToRegister={() => setCurrentPage('register')} />;
    }
    if (currentPage === 'register') {
      return <Register onSwitchToLogin={() => setCurrentPage('login')} />;
    }
    return (
      <LandingPage
        onLogin={() => setCurrentPage('login')}
        onRegister={() => setCurrentPage('register')}
      />
    );
  }

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: BarChart3 },
    { id: 'transactions' as Tab, label: 'Giao dịch', icon: List },
    { id: 'goals' as Tab, label: 'Mục tiêu', icon: Target },
    { id: 'analytics' as Tab, label: 'Phân tích', icon: Lightbulb },
    { id: 'export' as Tab, label: 'Xuất dữ liệu', icon: Download },
  ];

  return (
    <TransactionProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Finance Tracker</h1>
                  <p className="text-xs text-gray-500">Xin chào, {user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Thêm giao dịch</span>
                </button>

                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-3 mb-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition ${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-600 shadow-md'
                      : 'text-gray-600 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <TransactionList />}
          {activeTab === 'goals' && <BudgetGoals />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'export' && <ExportData />}
        </div>

        {showTransactionForm && (
          <TransactionForm onClose={() => setShowTransactionForm(false)} />
        )}
      </div>
    </TransactionProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
