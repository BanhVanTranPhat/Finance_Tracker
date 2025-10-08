import { useMemo } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { formatCurrency as formatCurrencyUtil } from '../utils/currency';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const categoryLabels: Record<string, string> = {
  food: 'Ăn uống',
  transportation: 'Đi lại',
  bills: 'Hóa đơn',
  shopping: 'Mua sắm',
  entertainment: 'Giải trí',
  healthcare: 'Y tế',
  education: 'Giáo dục',
  salary: 'Lương',
  business: 'Kinh doanh',
  investment: 'Đầu tư',
  other: 'Khác',
};

export default function Dashboard() {
  const { transactions, currency: defaultCurrency } = useTransactions();

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const last6Months = useMemo(() => {
    const now = new Date();
    const months = eachMonthOfInterval({
      start: subMonths(now, 5),
      end: now,
    });

    return months.map(month => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);

      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, 'MMM yyyy', { locale: vi }),
        income,
        expense,
      };
    });
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categorySums: Record<string, number> = {};

    expenses.forEach(t => {
      categorySums[t.category] = (categorySums[t.category] || 0) + t.amount;
    });

    return Object.entries(categorySums).map(([category, amount]) => ({
      category: categoryLabels[category] || category,
      amount,
    }));
  }, [transactions]);

  const lineChartData = {
    labels: last6Months.map(m => m.month),
    datasets: [
      {
        label: 'Thu nhập',
        data: last6Months.map(m => m.income),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Chi tiêu',
        data: last6Months.map(m => m.expense),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: last6Months.map(m => m.month),
    datasets: [
      {
        label: 'Thu nhập',
        data: last6Months.map(m => m.income),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'Chi tiêu',
        data: last6Months.map(m => m.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  const doughnutChartData = {
    labels: categoryData.map(c => c.category),
    datasets: [
      {
        data: categoryData.map(c => c.amount),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(100, 116, 139, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, defaultCurrency);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium opacity-90">Tổng thu nhập</h3>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(summary.income)}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium opacity-90">Tổng chi tiêu</h3>
            <TrendingDown className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(summary.expense)}</p>
        </div>

        <div className={`bg-gradient-to-br ${summary.balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-2xl p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium opacity-90">Số dư</h3>
            <Wallet className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(summary.balance)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Thu chi theo tháng</h3>
          <div className="h-80">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Chi tiêu theo danh mục</h3>
          <div className="h-80 flex items-center justify-center">
            {categoryData.length > 0 ? (
              <Doughnut data={doughnutChartData} options={chartOptions} />
            ) : (
              <p className="text-gray-500">Chưa có dữ liệu chi tiêu</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Xu hướng thu chi</h3>
        <div className="h-80">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
