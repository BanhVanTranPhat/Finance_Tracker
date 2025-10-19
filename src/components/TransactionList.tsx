import { useState, useMemo, useEffect } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import { formatCurrency as formatCurrencyUtil } from "../utils/currency";
import { Trash2, Filter, ArrowUpDown } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { transactionAPI } from "../services/api";
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

export default function TransactionList() {
  const {
    transactions,
    deleteTransaction,
    filters,
    setFilters,
    total,
    currentPage,
    totalPages,
  } = useTransactions();
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    filters.type || "all"
  );
  const [filterCategory, setFilterCategory] = useState<string>(
    filters.category || "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "amount">(
    (filters.sortBy as "date" | "amount") || "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    filters.sortOrder || "desc"
  );
  const [startDate, setStartDate] = useState<string>(filters.startDate || "");
  const [endDate, setEndDate] = useState<string>(filters.endDate || "");
  const [minAmount, setMinAmount] = useState<string>(
    filters.min !== undefined ? String(filters.min) : ""
  );
  const [maxAmount, setMaxAmount] = useState<string>(
    filters.max !== undefined ? String(filters.max) : ""
  );
  const [search, setSearch] = useState<string>(filters.search || "");
  const [presets, setPresets] = useState<Array<{ name: string; value: any }>>(
    () => {
      try {
        const raw = localStorage.getItem("tx_filter_presets");
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  const allCategories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  // Push local UI controls to server-side filters
  useMemo(() => {
    const f: any = {
      sortBy,
      sortOrder,
      page: filters.page,
      limit: filters.limit,
    };
    f.type = filterType;
    f.category = filterCategory === "all" ? undefined : filterCategory;
    setFilters(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterCategory, sortBy, sortOrder]);

  // Debounced push for date/min/max/search
  useEffect(() => {
    const handler = setTimeout(() => {
      const f: any = {};
      f.startDate = startDate || undefined;
      f.endDate = endDate || undefined;
      f.min = minAmount !== "" ? Number(minAmount) : undefined;
      f.max = maxAmount !== "" ? Number(maxAmount) : undefined;
      f.search = search || undefined;
      f.page = 1; // reset to first page on heavy filter change
      setFilters(f);
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, minAmount, maxAmount, search]);

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      deleteTransaction(id);
    }
  };

  const exportCurrentFiltersToCSV = async () => {
    const params: any = {
      ...filters,
      page: 1,
      limit: 10000,
    };
    if (filterType && filterType !== "all") params.type = filterType;
    params.category = filterCategory === "all" ? undefined : filterCategory;
    try {
      const resp = await transactionAPI.getTransactions(params);
      const rows = resp.transactions.map((t: any) => [
        format(new Date(t.date), "dd/MM/yyyy"),
        t.type === "income" ? "Thu nhập" : "Chi tiêu",
        categoryLabels[t.category] || t.category,
        t.amount.toString(),
        t.currency || "VND",
        t.note || "",
      ]);
      const header = [
        "Ngày",
        "Loại",
        "Danh mục",
        "Số tiền",
        "Tiền tệ",
        "Ghi chú",
      ];
      const csv = [
        header.join(","),
        ...rows.map((r: (string | number)[]) =>
          r
            .map(
              (c: string | number) => `"${String(c)}`.replace(/\n/g, " ") + '"'
            )
            .join(",")
        ),
      ].join("\n");
      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `giao_dich_loc_${format(new Date(), "dd-MM-yyyy")}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export CSV error", e);
      alert("Không thể xuất CSV. Vui lòng thử lại.");
    }
  };

  const exportSummaryToText = async () => {
    const params: any = {
      ...filters,
      page: 1,
      limit: 10000,
    };
    if (filterType && filterType !== "all") params.type = filterType;
    params.category = filterCategory === "all" ? undefined : filterCategory;
    try {
      const resp = await transactionAPI.getTransactions(params);
      const items: any[] = resp.transactions || [];
      const totalIncome = items
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
      const totalExpense = items
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      const balance = totalIncome - totalExpense;
      const categoryMap: Record<string, number> = {};
      items
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });
      const top = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      let content = "=== BÁO CÁO TÓM TẮT (THEO BỘ LỌC) ===\n\n";
      content += `Ngày xuất: ${format(new Date(), "dd/MM/yyyy HH:mm")}\n`;
      content += `Bộ lọc: loại=${filterType}, danh mục=${
        filterCategory === "all" ? "Tất cả" : filterCategory
      }, ngày=${startDate || "Từ đầu"}-${endDate || "Đến nay"}, tiền=${
        minAmount || 0
      }-${maxAmount || "∞"}, từ khóa=${search || "(không)"}\n`;
      content += `Tổng giao dịch: ${items.length}\n`;
      content += `Thu nhập: ${totalIncome}\n`;
      content += `Chi tiêu: ${totalExpense}\n`;
      content += `Số dư: ${balance}\n\n`;
      content += `Top danh mục chi tiêu:\n`;
      top.forEach(([cat, amt], idx) => {
        content += `  ${idx + 1}. ${
          (categoryLabels as any)[cat] || cat
        }: ${amt}\n`;
      });

      const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `bao_cao_loc_${format(new Date(), "dd-MM-yyyy_HH-mm")}.txt`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export summary error", e);
      alert("Không thể xuất tóm tắt. Vui lòng thử lại.");
    }
  };

  const saveCurrentFiltersAsPreset = () => {
    const name = prompt("Nhập tên preset bộ lọc");
    if (!name) return;
    const value = {
      type: filterType,
      category: filterCategory === "all" ? undefined : filterCategory,
      sortBy,
      sortOrder,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      min: minAmount !== "" ? Number(minAmount) : undefined,
      max: maxAmount !== "" ? Number(maxAmount) : undefined,
      search: search || undefined,
      page: 1,
    };
    const next = [...presets.filter((p) => p.name !== name), { name, value }];
    setPresets(next);
    localStorage.setItem("tx_filter_presets", JSON.stringify(next));
    setSelectedPreset(name);
  };

  const applyPreset = (name: string) => {
    setSelectedPreset(name);
    const p = presets.find((x) => x.name === name);
    if (!p) return;
    const v = p.value || {};
    setFilterType(v.type || "all");
    setFilterCategory(v.category || "all");
    setSortBy(v.sortBy || "date");
    setSortOrder(v.sortOrder || "desc");
    setStartDate(v.startDate || "");
    setEndDate(v.endDate || "");
    setMinAmount(v.min !== undefined ? String(v.min) : "");
    setMaxAmount(v.max !== undefined ? String(v.max) : "");
    setSearch(v.search || "");
    setFilters({ ...v, page: 1 });
  };

  const deletePreset = (name: string) => {
    const next = presets.filter((p) => p.name !== name);
    setPresets(next);
    localStorage.setItem("tx_filter_presets", JSON.stringify(next));
    if (selectedPreset === name) setSelectedPreset("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Danh sách giao dịch
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {total ?? transactions.length} giao dịch
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            aria-label="Lọc theo loại giao dịch"
          >
            <option value="all">Tất cả</option>
            <option value="income">Thu nhập</option>
            <option value="expense">Chi tiêu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            aria-label="Lọc theo danh mục"
          >
            <option value="all">Tất cả</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat] || cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sắp xếp theo
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            aria-label="Sắp xếp giao dịch"
          >
            <option value="date">Ngày</option>
            <option value="amount">Số tiền</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thứ tự
          </label>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            aria-label="Lọc từ ngày"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            aria-label="Lọc đến ngày"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số tiền tối thiểu
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="0"
            aria-label="Số tiền tối thiểu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số tiền tối đa
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="1000000"
            aria-label="Số tiền tối đa"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tìm kiếm ghi chú
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Nhập từ khóa..."
          aria-label="Tìm kiếm theo ghi chú"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
          onClick={() => {
            const now = new Date();
            setStartDate(startOfMonth(now).toISOString().slice(0, 10));
            setEndDate(endOfMonth(now).toISOString().slice(0, 10));
          }}
          title="Tháng này"
          aria-label="Lọc tháng này"
        >
          Tháng này
        </button>
        <button
          className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
          onClick={() => {
            const prev = subMonths(new Date(), 1);
            setStartDate(startOfMonth(prev).toISOString().slice(0, 10));
            setEndDate(endOfMonth(prev).toISOString().slice(0, 10));
          }}
          title="Tháng trước"
          aria-label="Lọc tháng trước"
        >
          Tháng trước
        </button>
        <button
          className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
          onClick={() => {
            setFilterType("all");
            setFilterCategory("all");
            setSortBy("date");
            setSortOrder("desc");
            setStartDate("");
            setEndDate("");
            setMinAmount("");
            setMaxAmount("");
            setSearch("");
            setFilters({
              page: 1,
              type: "all",
              category: undefined,
              sortBy: "date",
              sortOrder: "desc",
              startDate: undefined,
              endDate: undefined,
              min: undefined,
              max: undefined,
              search: undefined,
            });
          }}
          title="Xóa bộ lọc"
          aria-label="Xóa bộ lọc"
        >
          Xóa bộ lọc
        </button>
        <button
          className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
          onClick={exportCurrentFiltersToCSV}
          title="Xuất CSV theo bộ lọc"
          aria-label="Xuất CSV theo bộ lọc"
        >
          Xuất CSV (lọc)
        </button>
        <button
          className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
          onClick={exportSummaryToText}
          title="Xuất TXT tóm tắt theo bộ lọc"
          aria-label="Xuất TXT tóm tắt theo bộ lọc"
        >
          Xuất TXT (tóm tắt)
        </button>
        <button
          className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
          onClick={saveCurrentFiltersAsPreset}
          title="Lưu preset bộ lọc"
          aria-label="Lưu preset bộ lọc"
        >
          Lưu preset
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
        <span className="font-semibold mr-2">Bộ lọc:</span>
        <span>Loại: {filterType === "all" ? "Tất cả" : filterType}</span>
        {" • "}
        <span>
          Danh mục:{" "}
          {filterCategory === "all"
            ? "Tất cả"
            : categoryLabels[filterCategory] || filterCategory}
        </span>
        {startDate || endDate ? (
          <>
            {" • "}
            <span>
              Ngày: {startDate || "Từ đầu"} - {endDate || "Đến nay"}
            </span>
          </>
        ) : null}
        {(minAmount || maxAmount) && (
          <>
            {" • "}
            <span>
              Số tiền: {minAmount || 0} - {maxAmount || "∞"}
            </span>
          </>
        )}
        {search && (
          <>
            {" • "}
            <span>Tìm kiếm: "{search}"</span>
          </>
        )}
      </div>

      {presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-gray-600 mr-2">Preset:</span>
          {presets.map((p) => (
            <div key={p.name} className="flex items-center gap-1">
              <button
                className={`px-3 py-1 rounded-lg text-sm border ${
                  selectedPreset === p.name
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => applyPreset(p.name)}
                title={`Áp dụng preset: ${p.name}`}
                aria-label={`Áp dụng preset: ${p.name}`}
              >
                {p.name}
              </button>
              <button
                className="text-gray-400 hover:text-red-500 px-1"
                onClick={() => deletePreset(p.name)}
                title={`Xóa preset: ${p.name}`}
                aria-label={`Xóa preset: ${p.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Chưa có giao dịch nào</p>
            <p className="text-gray-400 text-sm mt-2">
              Thêm giao dịch đầu tiên của bạn
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === "income"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.type === "income" ? "Thu nhập" : "Chi tiêu"}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {categoryLabels[transaction.category] ||
                        transaction.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {format(new Date(transaction.date), "dd MMM yyyy", {
                        locale: vi,
                      })}
                    </span>
                    {transaction.note && (
                      <span className="truncate max-w-xs">
                        {transaction.note}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-xl font-bold ${
                      transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrencyUtil(transaction.amount)}
                  </span>

                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg"
                    title="Xóa giao dịch"
                    aria-label="Xóa giao dịch"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Trang {currentPage ?? 1} / {totalPages ?? 1}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={() =>
              setFilters({ page: Math.max((filters.page || 1) - 1, 1) })
            }
            disabled={(currentPage || 1) <= 1}
            aria-label="Trang trước"
            title="Trang trước"
          >
            Trước
          </button>
          <button
            className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={() =>
              setFilters({
                page: Math.min((filters.page || 1) + 1, totalPages || 1),
              })
            }
            disabled={(currentPage || 1) >= (totalPages || 1)}
            aria-label="Trang sau"
            title="Trang sau"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
