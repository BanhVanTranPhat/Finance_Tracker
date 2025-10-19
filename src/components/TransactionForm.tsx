import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTransactions, Currency } from "../contexts/TransactionContext";
import { X, Plus } from "lucide-react";
import { formatNumber, parseFormattedNumber } from "../utils/currency";

const TransactionSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(["income", "expense"])
    .required("Vui lòng chọn loại giao dịch"),
  amount: Yup.string().required("Vui lòng nhập số tiền"),
  currency: Yup.string()
    .oneOf(["VND"]) // fixed currency
    .required("Vui lòng chọn loại tiền"),
  date: Yup.date().required("Vui lòng chọn ngày"),
  category: Yup.string().required("Vui lòng chọn danh mục"),
  note: Yup.string(),
});

interface TransactionFormProps {
  onClose: () => void;
}

const categories = {
  income: [
    { value: "salary", label: "Lương" },
    { value: "business", label: "Kinh doanh" },
    { value: "investment", label: "Đầu tư" },
    { value: "other", label: "Khác" },
  ],
  expense: [
    { value: "food", label: "Ăn uống" },
    { value: "transportation", label: "Đi lại" },
    { value: "bills", label: "Hóa đơn" },
    { value: "shopping", label: "Mua sắm" },
    { value: "entertainment", label: "Giải trí" },
    { value: "healthcare", label: "Y tế" },
    { value: "education", label: "Giáo dục" },
    { value: "other", label: "Khác" },
  ],
};

export default function TransactionForm({ onClose }: TransactionFormProps) {
  const { addTransaction } = useTransactions();
  const [displayAmount, setDisplayAmount] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Thêm giao dịch</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            title="Đóng form"
            aria-label="Đóng form thêm giao dịch"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Formik
          initialValues={{
            type: "expense" as "income" | "expense",
            amount: "",
            currency: "VND" as Currency,
            date: new Date().toISOString().split("T")[0],
            category: "",
            note: "",
          }}
          validationSchema={TransactionSchema}
          onSubmit={(values, { setSubmitting }) => {
            const amount = parseFormattedNumber(values.amount);
            if (amount > 0) {
              addTransaction({
                type: values.type,
                amount,
                currency: values.currency as Currency,
                date: values.date,
                category: values.category,
                note: values.note,
              });
            }
            setSubmitting(false);
            onClose();
          }}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại giao dịch
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center cursor-pointer">
                    <Field
                      type="radio"
                      name="type"
                      value="expense"
                      className="sr-only peer"
                    />
                    <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 transition text-center font-medium">
                      Chi tiêu
                    </div>
                  </label>
                  <label className="flex items-center justify-center cursor-pointer">
                    <Field
                      type="radio"
                      name="type"
                      value="income"
                      className="sr-only peer"
                    />
                    <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition text-center font-medium">
                      Thu nhập
                    </div>
                  </label>
                </div>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiền tệ: VNĐ (cố định)
                </label>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Số tiền
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="amount"
                    id="amount"
                    value={displayAmount}
                    onChange={(e) => {
                      const formatted = formatNumber(e.target.value);
                      setDisplayAmount(formatted);
                      setFieldValue("amount", formatted);
                    }}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    placeholder={"200,000"}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₫
                  </span>
                </div>
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
                {displayAmount && (
                  <p className="text-xs text-gray-500 mt-1">
                    Giá trị:{" "}
                    {parseFormattedNumber(displayAmount).toLocaleString()}{" "}
                    {values.currency}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ngày giao dịch
                </label>
                <Field
                  type="date"
                  name="date"
                  id="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Danh mục
                </label>
                <Field
                  as="select"
                  name="category"
                  id="category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                >
                  <option value="">Chọn danh mục</option>
                  {categories[values.type].map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ghi chú (tùy chọn)
                </label>
                <Field
                  as="textarea"
                  name="note"
                  id="note"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
                  placeholder="Thêm ghi chú..."
                />
                <ErrorMessage
                  name="note"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                {isSubmitting ? "Đang thêm..." : "Thêm giao dịch"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
