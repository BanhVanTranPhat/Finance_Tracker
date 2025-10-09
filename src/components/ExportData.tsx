import { useState } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import { Download, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const categoryLabels: Record<string, string> = {
  food: "Ăn uống",
  transportation: "Đi lại",
  bills: "Hóa đơn",
  shopping: "Mua sắm",
  entertainment: "Giải trí",
  healthcare: "Y tế",
  education: "Giáo dục",
  salary: "Lương",
  business: "Kinh doanh",
  investment: "Đầu tư",
  other: "Khác",
};

export default function ExportData() {
  const { transactions } = useTransactions();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filterTransactionsByDate = () => {
    if (!dateFrom && !dateTo) return transactions;

    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      const from = dateFrom ? new Date(dateFrom) : new Date("1900-01-01");
      const to = dateTo ? new Date(dateTo) : new Date("2100-12-31");
      return tDate >= from && tDate <= to;
    });
  };

  const exportToCSV = () => {
    const filteredTransactions = filterTransactionsByDate();

    if (filteredTransactions.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const headers = [
      "Ngày",
      "Loại",
      "Danh mục",
      "Số tiền",
      "Tiền tệ",
      "Ghi chú",
    ];
    const rows = filteredTransactions.map((t) => [
      format(new Date(t.date), "dd/MM/yyyy"),
      t.type === "income" ? "Thu nhập" : "Chi tiêu",
      categoryLabels[t.category] || t.category,
      t.amount.toString(),
      "VND",
      t.note || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `giao_dich_${format(new Date(), "dd-MM-yyyy")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSummaryToText = () => {
    const filteredTransactions = filterTransactionsByDate();

    if (filteredTransactions.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryExpenses: Record<string, number> = {};
    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryExpenses[t.category] =
          (categoryExpenses[t.category] || 0) + t.amount;
      });

    let content = "=== BÁO CÁO TÀI CHÍNH ===\n\n";
    content += `Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm")}\n`;

    if (dateFrom || dateTo) {
      content += `Khoảng thời gian: ${
        dateFrom ? format(new Date(dateFrom), "dd/MM/yyyy") : "Từ đầu"
      } - ${dateTo ? format(new Date(dateTo), "dd/MM/yyyy") : "Đến nay"}\n`;
    }

    content += `\n--- TỔNG QUAN ---\n`;
    content += `Tổng thu nhập: ${totalIncome}\n`;
    content += `Tổng chi tiêu: ${totalExpense}\n`;
    content += `Số dư: ${totalIncome - totalExpense}\n`;
    content += `Tổng giao dịch: ${filteredTransactions.length}\n`;

    if (Object.keys(categoryExpenses).length > 0) {
      content += `\n--- CHI TIÊU THEO DANH MỤC ---\n`;
      Object.entries(categoryExpenses)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, amount]) => {
          const percentage = ((amount / totalExpense) * 100).toFixed(1);
          content += `${categoryLabels[category]}: ${amount} (${percentage}%)\n`;
        });
    }

    content += `\n--- CHI TIẾT GIAO DỊCH ---\n`;
    filteredTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((t) => {
        content += `\n${format(new Date(t.date), "dd/MM/yyyy", {
          locale: vi,
        })} - ${t.type === "income" ? "THU" : "CHI"}\n`;
        content += `  Danh mục: ${categoryLabels[t.category]}\n`;
        content += `  Số tiền: ${t.amount} ${t.currency || "VND"}\n`;
        if (t.note) {
          content += `  Ghi chú: ${t.note}\n`;
        }
      });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bao_cao_tai_chinh_${format(new Date(), "dd-MM-yyyy")}.txt`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-teal-500 p-2 rounded-lg">
          <Download className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Xuất dữ liệu</h2>
          <p className="text-gray-600">Tải xuống báo cáo tài chính của bạn</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">
            Lọc theo khoảng thời gian
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="dateFrom"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Từ ngày
            </label>
            <input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="dateTo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Đến ngày
            </label>
            <input
              type="date"
              id="dateTo"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>
        </div>

        {(dateFrom || dateTo) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Lọc:</strong>{" "}
              {dateFrom ? format(new Date(dateFrom), "dd/MM/yyyy") : "Từ đầu"} -{" "}
              {dateTo ? format(new Date(dateTo), "dd/MM/yyyy") : "Đến nay"} (
              {filterTransactionsByDate().length} giao dịch)
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={exportToCSV}
            disabled={transactions.length === 0}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-4 rounded-xl font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <div className="text-left">
              <div>Xuất CSV</div>
              <div className="text-xs opacity-90">Mở bằng Excel</div>
            </div>
          </button>

          <button
            onClick={exportSummaryToText}
            disabled={transactions.length === 0}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-5 h-5" />
            <div className="text-left">
              <div>Xuất báo cáo</div>
              <div className="text-xs opacity-90">File văn bản chi tiết</div>
            </div>
          </button>
        </div>

        {transactions.length === 0 && (
          <div className="text-center mt-6">
            <p className="text-gray-500">Chưa có giao dịch nào để xuất</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Thống kê nhanh</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">
              {transactions.filter((t) => t.type === "income").length}
            </p>
            <p className="text-sm text-gray-600">Thu nhập</p>
          </div>

          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <p className="text-2xl font-bold text-red-600">
              {transactions.filter((t) => t.type === "expense").length}
            </p>
            <p className="text-sm text-gray-600">Chi tiêu</p>
          </div>

          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <p className="text-2xl font-bold text-blue-600">
              {transactions.length}
            </p>
            <p className="text-sm text-gray-600">Tổng giao dịch</p>
          </div>

          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <p className="text-2xl font-bold text-purple-600">
              {new Set(transactions.map((t) => t.category)).size}
            </p>
            <p className="text-sm text-gray-600">Danh mục</p>
          </div>
        </div>
      </div>
    </div>
  );
}
