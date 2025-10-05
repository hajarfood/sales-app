import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NavigationBar from "@/components/dashboard/NavigationBar";
import {
  BarChart3,
  FileText,
  TrendingUp,
  PieChart,
  Printer,
  FileSpreadsheet,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import CentralSystem from "@/services/CentralSystem";

const Reports = () => {
  const [activeReport, setActiveReport] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [accountStatementDateFrom, setAccountStatementDateFrom] = useState<
    Date | undefined
  >(new Date());
  const [accountStatementDateTo, setAccountStatementDateTo] = useState<
    Date | undefined
  >(new Date());
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isAccountsLoading, setIsAccountsLoading] = useState(true);
  const [reportDateFrom, setReportDateFrom] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [reportDateTo, setReportDateTo] = useState<Date | undefined>(
    new Date()
  );
  const [currentReportType, setCurrentReportType] = useState<string>("");

  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [productMovementDateFrom, setProductMovementDateFrom] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [productMovementDateTo, setProductMovementDateTo] = useState<Date | undefined>(
    new Date()
  );

  const centralSystem = CentralSystem.getInstance();

  // Load accounts on component mount
  useEffect(() => {
    const loadAccounts = () => {
      try {
        setIsAccountsLoading(true);
        // Wait a bit for CentralSystem to initialize
        setTimeout(() => {
          const systemAccounts = centralSystem.getAllAccountsFlat();
          console.log("Loaded accounts:", systemAccounts.length);
          setAccounts(systemAccounts);
          setIsAccountsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error loading accounts:", error);
        setIsAccountsLoading(false);
      }
    };

    // Load accounts immediately
    loadAccounts();

    // Add listener for account updates
    const handleAccountsUpdate = () => {
      console.log("Accounts updated, reloading...");
      loadAccounts();
    };

    centralSystem.addListener(handleAccountsUpdate);

    // Cleanup listener on unmount
    return () => {
      centralSystem.removeListener(handleAccountsUpdate);
    };
  }, [centralSystem]);

  // Force refresh accounts when report is opened
  const refreshAccountsData = () => {
    console.log("Refreshing accounts data...");
    setIsAccountsLoading(true);
    setTimeout(() => {
      try {
        const systemAccounts = centralSystem.getAllAccountsFlat();
        console.log("Refreshed accounts:", systemAccounts.length);
        setAccounts(systemAccounts);
        setIsAccountsLoading(false);
      } catch (error) {
        console.error("Error refreshing accounts:", error);
        setIsAccountsLoading(false);
      }
    }, 300);
  };

  // Add useEffect to refresh report when dates change
  useEffect(() => {
    if (currentReportType && isReportOpen) {
      showFinancialReport(currentReportType);
    }
  }, [reportDateFrom, reportDateTo]);

  // Update account statement when dependencies change
  useEffect(() => {
    if (selectedAccount && accountStatementDateFrom && accountStatementDateTo && currentReportType === "account-statement") {
      setTimeout(() => {
        showFinancialReport("account-statement");
      }, 100);
    }
  }, [selectedAccount, accountStatementDateFrom, accountStatementDateTo]);

  // Update product movement when dependencies change
  useEffect(() => {
    if (selectedProduct && productMovementDateFrom && productMovementDateTo && currentReportType === "product-movement") {
      setTimeout(() => {
        showFinancialReport("product-movement");
      }, 100);
    }
  }, [selectedProduct, productMovementDateFrom, productMovementDateTo]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    alert("تصدير إلى Excel - سيتم تطبيق هذه الوظيفة لاحقاً");
  };

  const handleExportPDF = () => {
    alert("تصدير إلى PDF - سيتم تطبيق هذه الوظيفة لاحقاً");
  };

  const getActualData = () => {
    // Get actual data from localStorage
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
    const products = JSON.parse(
      localStorage.getItem("inventory_products") || "[]",
    );
    const customers = JSON.parse(localStorage.getItem("customers") || "[]");
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");

    return { invoices, purchases, products, customers, suppliers };
  };

  const filterDataByDate = (data: any[], dateField: string = "date") => {
    if (!reportDateFrom || !reportDateTo) return data;
    
    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      const fromDate = new Date(reportDateFrom);
      const toDate = new Date(reportDateTo);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  // Add date filter component
  const DateFilterSection = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h4 className="font-semibold mb-3">فلتر التاريخ</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>من تاريخ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {reportDateFrom
                  ? format(reportDateFrom, "dd/MM/yyyy")
                  : "اختر التاريخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={reportDateFrom}
                onSelect={(date) => {
                  setReportDateFrom(date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>إلى تاريخ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {reportDateTo
                  ? format(reportDateTo, "dd/MM/yyyy")
                  : "اختر التاريخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={reportDateTo}
                onSelect={(date) => {
                  setReportDateTo(date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );

  const showFinancialReport = (reportType: string) => {
    setCurrentReportType(reportType);
    const accounts = centralSystem.getAllAccountsFlat();
    const customers = centralSystem.getCustomers();
    const suppliers = centralSystem.getSuppliers();
    const actualData = getActualData();

    let reportContent;
    let reportTitle;

    switch (reportType) {
      case "balance-sheet":
        reportTitle = "قائمة المركز المالي";
        reportContent = (
          <div className="space-y-6">
            <DateFilterSection />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">
                  الأصول
                </h3>
                <div className="space-y-2">
                  {accounts
                    .filter((acc) => acc.type === "assets")
                    .map((account) => (
                      <div
                        key={account.id}
                        className="flex justify-between p-2 border-b"
                      >
                        <span>{account.name}</span>
                        <span className="font-bold">
                          {account.balance.toLocaleString()} ر.س
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-600">
                  الخصوم
                </h3>
                <div className="space-y-2">
                  {accounts
                    .filter((acc) => acc.type === "liabilities")
                    .map((account) => (
                      <div
                        key={account.id}
                        className="flex justify-between p-2 border-b"
                      >
                        <span>{account.name}</span>
                        <span className="font-bold">
                          {account.balance.toLocaleString()} ر.س
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        );
        break;
      case "income-statement":
        reportTitle = "قائمة الأرباح والخسائر";
        const revenues = accounts.filter((acc) => acc.type === "revenue");
        const expenses = accounts.filter((acc) => acc.type === "expenses");
        const totalRevenue = revenues.reduce(
          (sum, acc) => sum + acc.balance,
          0,
        );
        const totalExpenses = expenses.reduce(
          (sum, acc) => sum + acc.balance,
          0,
        );
        const netIncome = totalRevenue - totalExpenses;

        reportContent = (
          <div className="space-y-6">
            <DateFilterSection />
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                الإيرادات
              </h3>
              <div className="space-y-2">
                {revenues.map((account) => (
                  <div
                    key={account.id}
                    className="flex justify-between p-2 border-b"
                  >
                    <span>{account.name}</span>
                    <span className="font-bold">
                      {account.balance.toLocaleString()} ر.س
                    </span>
                  </div>
                ))}
                <div className="flex justify-between p-2 bg-blue-50 font-bold">
                  <span>إجمالي الإيرادات</span>
                  <span>{totalRevenue.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-600">
                المصروفات
              </h3>
              <div className="space-y-2">
                {expenses.map((account) => (
                  <div
                    key={account.id}
                    className="flex justify-between p-2 border-b"
                  >
                    <span>{account.name}</span>
                    <span className="font-bold">
                      {account.balance.toLocaleString()} ر.س
                    </span>
                  </div>
                ))}
                <div className="flex justify-between p-2 bg-orange-50 font-bold">
                  <span>إجمالي المصروفات</span>
                  <span>{totalExpenses.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>
            <div
              className={`flex justify-between p-4 rounded-lg font-bold text-lg ${
                netIncome >= 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span>صافي {netIncome >= 0 ? "الربح" : "الخسارة"}</span>
              <span>{Math.abs(netIncome).toLocaleString()} ر.س</span>
            </div>
          </div>
        );
        break;
      case "trial-balance":
        reportTitle = "ميزان المراجعة";
        const allAccounts = centralSystem.getAllAccountsFlat();
        reportContent = (
          <div className="space-y-4">
            <DateFilterSection />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-right border">رقم الحساب</th>
                    <th className="p-3 text-right border">اسم الحساب</th>
                    <th className="p-3 text-right border">نوع الحساب</th>
                    <th className="p-3 text-right border">الرصيد</th>
                  </tr>
                </thead>
                <tbody>
                  {allAccounts.map((account) => (
                    <tr key={account.id}>
                      <td className="p-3 border">{account.code}</td>
                      <td className="p-3 border">{account.name}</td>
                      <td className="p-3 border">
                        {account.type === "assets"
                          ? "أصول"
                          : account.type === "liabilities"
                            ? "خصوم"
                            : account.type === "revenue"
                              ? "إيرادات"
                              : account.type === "expenses"
                                ? "مصروفات"
                                : "حقوق ملكية"}
                      </td>
                      <td className="p-3 border font-bold">
                        {account.balance.toLocaleString()} ر.س
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        break;
      case "cash-flow":
        reportTitle = "قائمة التدفقات النقدية";
        reportContent = (
          <div className="space-y-6">
            <DateFilterSection />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">التدفقات التشغيلية</h4>
                  <p className="text-2xl font-bold text-green-600">
                    125,400 ر.س
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">التدفقات الاستثمارية</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    -45,200 ر.س
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">التدفقات التمويلية</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    23,800 ر.س
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        break;
      case "end-of-day":
        reportTitle = "إغلاق اليوم";
        reportContent = (
          <div className="space-y-6">
            <DateFilterSection />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">المبيعات اليومية</h4>
                  <p className="text-2xl font-bold text-blue-600">15,600 ر.س</p>
                  <p className="text-sm text-gray-600">12 فاتورة</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">الأرباح اليومية</h4>
                  <p className="text-2xl font-bold text-green-600">4,200 ر.س</p>
                  <p className="text-sm text-gray-600">هامش ربح 27%</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">المصروفات اليومية</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    2,800 ر.س
                  </p>
                  <p className="text-sm text-gray-600">5 معاملات</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        break;
      case "inventory":
        reportTitle = "تقرير المخزون";
        const totalProducts = actualData.products.length;
        const totalValue = actualData.products.reduce(
          (sum, p) => sum + p.salePrice * p.quantity,
          0,
        );
        const lowStockProducts = actualData.products.filter(
          (p) => p.quantity <= 10 && p.quantity > 0,
        ).length;
        const outOfStockProducts = actualData.products.filter(
          (p) => p.quantity === 0,
        ).length;

        reportContent = (
          <div className="space-y-6">
            <DateFilterSection />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-teal-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">إجمالي المنتجات</h4>
                  <p className="text-2xl font-bold text-teal-600">
                    {totalProducts}
                  </p>
                  <p className="text-sm text-gray-600">منتج</p>
                </CardContent>
              </Card>
              <Card className="bg-cyan-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">قيمة المخزون</h4>
                  <p className="text-2xl font-bold text-cyan-600">
                    {totalValue.toLocaleString()} ر.س
                  </p>
                  <p className="text-sm text-gray-600">إجمالي القيمة</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">منتجات منخفضة</h4>
                  <p className="text-2xl font-bold text-amber-600">
                    {lowStockProducts}
                  </p>
                  <p className="text-sm text-gray-600">تحتاج إعادة طلب</p>
                </CardContent>
              </Card>
              <Card className="bg-rose-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">منتجات نفدت</h4>
                  <p className="text-2xl font-bold text-rose-600">
                    {outOfStockProducts}
                  </p>
                  <p className="text-sm text-gray-600">غير متوفرة</p>
                </CardContent>
              </Card>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-right border">اسم المنتج</th>
                    <th className="p-3 text-right border">الكود</th>
                    <th className="p-3 text-right border">الكمية</th>
                    <th className="p-3 text-right border">سعر البيع</th>
                    <th className="p-3 text-right border">القيمة الإجمالية</th>
                    <th className="p-3 text-right border">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {actualData.products.map((product) => (
                    <tr key={product.id}>
                      <td className="p-3 border">{product.name}</td>
                      <td className="p-3 border">{product.code}</td>
                      <td className="p-3 border">{product.quantity}</td>
                      <td className="p-3 border">
                        {product.salePrice.toFixed(2)} ر.س
                      </td>
                      <td className="p-3 border">
                        {(product.salePrice * product.quantity).toFixed(2)} ر.س
                      </td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            product.status === "متوفر"
                              ? "bg-green-100 text-green-800"
                              : product.status === "منخفض"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        break;
      case "customers":
        reportTitle = "تقرير العملاء";
        const totalCustomers = actualData.customers.length;
        const totalCustomerSales = actualData.invoices.reduce(
          (sum, inv) => sum + inv.amount,
          0,
        );
        const avgCustomerPurchase =
          totalCustomers > 0 ? totalCustomerSales / totalCustomers : 0;

        reportContent = (
          <div className="space-y-6">
            <DateFilterSection />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">إجمالي العملاء</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalCustomers}
                  </p>
                  <p className="text-sm text-gray-600">عميل نشط</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">إجمالي المبيعات</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {totalCustomerSales.toLocaleString()} ر.س
                  </p>
                  <p className="text-sm text-gray-600">من العملاء</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">متوسط الشراء</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {avgCustomerPurchase.toFixed(0)} ر.س
                  </p>
                  <p className="text-sm text-gray-600">للعميل الواحد</p>
                </CardContent>
              </Card>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-right border">اسم العميل</th>
                    <th className="p-3 text-right border">الهاتف</th>
                    <th className="p-3 text-right border">البريد الإلكتروني</th>
                    <th className="p-3 text-right border">إجمالي المشتريات</th>
                    <th className="p-3 text-right border">آخر زيارة</th>
                  </tr>
                </thead>
                <tbody>
                  {actualData.customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="p-3 border">{customer.name}</td>
                      <td className="p-3 border">{customer.phone}</td>
                      <td className="p-3 border">{customer.email}</td>
                      <td className="p-3 border">
                        {customer.totalPurchases.toFixed(2)} ر.س
                      </td>
                      <td className="p-3 border">{customer.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        break;
      case "comprehensive":
        reportTitle = "التقرير الشامل";
        const compFilteredInvoices = filterDataByDate(actualData.invoices);
        const compFilteredPurchases = filterDataByDate(actualData.purchases);
        const compSales = compFilteredInvoices.reduce(
          (sum, inv) => sum + inv.amount,
          0,
        );
        const compPurchases = compFilteredPurchases.reduce(
          (sum, purch) => sum + purch.amount,
          0,
        );
        const compProfit = compSales - compPurchases;
        const profitMargin = compSales > 0 ? (compProfit / compSales) * 100 : 0;

        reportContent = (
          <div className="space-y-6">
            <DateFilterSection />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">المبيعات</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {compSales.toLocaleString()} ر.س
                  </p>
                  <p className="text-sm text-gray-600">
                    {compFilteredInvoices.length} فاتورة
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">المشتريات</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    {compPurchases.toLocaleString()} ر.س
                  </p>
                  <p className="text-sm text-gray-600">
                    {compFilteredPurchases.length} طلب
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">الأرباح</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {compProfit.toLocaleString()} ر.س
                  </p>
                  <p className="text-sm text-gray-600">
                    هامش ربح {profitMargin.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">العملاء</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {actualData.customers.length}
                  </p>
                  <p className="text-sm text-gray-600">عميل نشط</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">أحدث المنتجات</h4>
                <div className="space-y-2">
                  {actualData.products.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between p-2 bg-gray-50 rounded"
                    >
                      <span>{product.name}</span>
                      <span className="font-bold">{product.quantity} قطعة</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">أحدث العملاء</h4>
                <div className="space-y-2">
                  {actualData.customers.slice(0, 5).map((customer) => (
                    <div
                      key={customer.id}
                      className="flex justify-between p-2 bg-gray-50 rounded"
                    >
                      <span>{customer.name}</span>
                      <span className="font-bold">
                        {customer.totalPurchases.toFixed(0)} ر.س
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        break;
      case "sales":
        reportTitle = "تقرير المبيعات";
        const filteredInvoices = filterDataByDate(actualData.invoices);
        const totalSales = filteredInvoices.reduce(
          (sum, inv) => sum + inv.amount,
          0,
        );
        const avgInvoice =
          filteredInvoices.length > 0
            ? totalSales / filteredInvoices.length
            : 0;

        reportContent = (
          <div className="space-y-6">
            <DateFilterSection />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">إجمالي المبيعات</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalSales.toLocaleString()} ر.س
                  </p>
                  <p className="text-sm text-gray-600">
                    {filteredInvoices.length} فاتورة
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">متوسط الفاتورة</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {avgInvoice.toFixed(0)} ر.س
                  </p>
                  <p className="text-sm text-gray-600">للفاتورة الواحدة</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">عدد العملاء</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {actualData.customers.length}
                  </p>
                  <p className="text-sm text-gray-600">عميل نشط</p>
                </CardContent>
              </Card>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-right border">رقم الفاتورة</th>
                    <th className="p-3 text-right border">التاريخ</th>
                    <th className="p-3 text-right border">العميل</th>
                    <th className="p-3 text-right border">المبلغ</th>
                    <th className="p-3 text-right border">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="p-3 border">{invoice.id}</td>
                      <td className="p-3 border">{invoice.date}</td>
                      <td className="p-3 border">{invoice.customer}</td>
                      <td className="p-3 border">
                        {invoice.amount.toFixed(2)} ر.س
                      </td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            invoice.status === "مدفوعة"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "معلقة"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        break;
      case "purchases":
        reportTitle = "تقرير المشتريات";
        const filteredPurchases = filterDataByDate(actualData.purchases);
        const totalPurchases = filteredPurchases.reduce(
          (sum, purch) => sum + purch.amount,
          0,
        );
        const avgPurchase =
          filteredPurchases.length > 0
            ? totalPurchases / filteredPurchases.length
            : 0;

        reportContent = (
          <div className="space-y-6">
            <DateFilterSection />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-orange-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">إجمالي المشتريات</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    {totalPurchases.toLocaleString()} ر.س
                  </p>
                  <p className="text-sm text-gray-600">
                    {filteredPurchases.length} طلب
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-red-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">عدد الموردين</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {actualData.suppliers.length}
                  </p>
                  <p className="text-sm text-gray-600">مورد نشط</p>
                </CardContent>
              </Card>
              <Card className="bg-indigo-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">متوسط الطلب</h4>
                  <p className="text-2xl font-bold text-indigo-600">
                    {avgPurchase.toFixed(0)} ر.س
                  </p>
                  <p className="text-sm text-gray-600">للطلب الواحد</p>
                </CardContent>
              </Card>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-right border">رقم الطلب</th>
                    <th className="p-3 text-right border">التاريخ</th>
                    <th className="p-3 text-right border">المورد</th>
                    <th className="p-3 text-right border">المبلغ</th>
                    <th className="p-3 text-right border">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="p-3 border">{purchase.id}</td>
                      <td className="p-3 border">{purchase.date}</td>
                      <td className="p-3 border">{purchase.supplier}</td>
                      <td className="p-3 border">
                        {purchase.amount.toFixed(2)} ر.س
                      </td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            purchase.status === "مستلم"
                              ? "bg-green-100 text-green-800"
                              : purchase.status === "قيد التنفيذ"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        break;
      case "account-statement":
        reportTitle = "كشف الحساب";
        // Ensure we have fresh accounts data
        if (accounts.length === 0) {
          refreshAccountsData();
        }
        const selectedAccountData = accounts.find(
          (acc) => acc.id === selectedAccount,
        );
        console.log("Selected account data:", selectedAccountData);

        // Generate mock transactions for the selected account
        const generateAccountTransactions = () => {
          if (
            !selectedAccountData ||
            !accountStatementDateFrom ||
            !accountStatementDateTo
          ) {
            return [];
          }

          const transactions = [];
          const startDate = new Date(accountStatementDateFrom);
          const endDate = new Date(accountStatementDateTo);
          let runningBalance = selectedAccountData.balance;

          // Add opening balance
          transactions.push({
            id: "opening",
            date: format(startDate, "yyyy-MM-dd"),
            description: "الرصيد الافتتاحي",
            reference: "-",
            debit:
              selectedAccountData.type === "assets" ||
              selectedAccountData.type === "expenses"
                ? selectedAccountData.balance
                : 0,
            credit:
              selectedAccountData.type === "liabilities" ||
              selectedAccountData.type === "revenue" ||
              selectedAccountData.type === "equity"
                ? selectedAccountData.balance
                : 0,
            balance: selectedAccountData.balance,
          });

          // Generate sample transactions
          const sampleTransactions = [
            { description: "فاتورة مبيعات رقم 001", debit: 0, credit: 5000 },
            { description: "دفعة نقدية", debit: 3000, credit: 0 },
            { description: "فاتورة مبيعات رقم 002", debit: 0, credit: 2500 },
            { description: "تحويل بنكي", debit: 1500, credit: 0 },
            { description: "فاتورة مبيعات رقم 003", debit: 0, credit: 3200 },
          ];

          sampleTransactions.forEach((trans, index) => {
            const transDate = new Date(startDate);
            transDate.setDate(startDate.getDate() + index + 1);

            if (transDate <= endDate) {
              runningBalance += trans.debit - trans.credit;
              transactions.push({
                id: `trans-${index}`,
                date: format(transDate, "yyyy-MM-dd"),
                description: trans.description,
                reference: `REF-${String(index + 1).padStart(3, "0")}`,
                debit: trans.debit,
                credit: trans.credit,
                balance: runningBalance,
              });
            }
          });

          return transactions;
        };

        const accountTransactions = generateAccountTransactions();
        const totalDebit = accountTransactions.reduce(
          (sum, trans) => sum + trans.debit,
          0,
        );
        const totalCredit = accountTransactions.reduce(
          (sum, trans) => sum + trans.credit,
          0,
        );

        reportContent = (
          <div className="space-y-6">
            {/* Account Selection and Date Range */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-lg">إعدادات كشف الحساب</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account-select">اختيار الحساب</Label>
                  <Select
                    value={selectedAccount}
                    onValueChange={(value) => {
                      console.log("Account selected:", value);
                      setSelectedAccount(value);
                      // Trigger report refresh when account changes
                      if (
                        value &&
                        accountStatementDateFrom &&
                        accountStatementDateTo
                      ) {
                        setTimeout(() => {
                          showFinancialReport("account-statement");
                        }, 100);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isAccountsLoading ? "جاري التحميل..." : "اختر الحساب"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isAccountsLoading ? (
                        <SelectItem value="loading" disabled>
                          جاري التحميل...
                        </SelectItem>
                      ) : accounts && accounts.length > 0 ? (
                        accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.code} - {account.name}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="no-accounts" disabled>
                            لا توجد حسابات متاحة
                          </SelectItem>
                          <SelectItem
                            value="refresh"
                            onClick={refreshAccountsData}
                          >
                            إعادة تحميل الحسابات
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>من تاريخ</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {accountStatementDateFrom
                          ? format(accountStatementDateFrom, "dd/MM/yyyy")
                          : "اختر التاريخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={accountStatementDateFrom}
                        onSelect={(date) => {
                          console.log("From date selected:", date);
                          setAccountStatementDateFrom(date);
                          // Trigger report refresh when date changes
                          if (
                            selectedAccount &&
                            date &&
                            accountStatementDateTo
                          ) {
                            setTimeout(() => {
                              showFinancialReport("account-statement");
                            }, 100);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>إلى تاريخ</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {accountStatementDateTo
                          ? format(accountStatementDateTo, "dd/MM/yyyy")
                          : "اختر التاريخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={accountStatementDateTo}
                        onSelect={(date) => {
                          console.log("To date selected:", date);
                          setAccountStatementDateTo(date);
                          // Trigger report refresh when date changes
                          if (
                            selectedAccount &&
                            date &&
                            accountStatementDateFrom
                          ) {
                            setTimeout(() => {
                              showFinancialReport("account-statement");
                            }, 100);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {selectedAccountData && (
              <div className="space-y-4">
                {/* Account Header */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    كشف حساب: {selectedAccountData.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">رقم الحساب: </span>
                      <span>{selectedAccountData.code}</span>
                    </div>
                    <div>
                      <span className="font-semibold">نوع الحساب: </span>
                      <span>
                        {selectedAccountData.type === "assets"
                          ? "أصول"
                          : selectedAccountData.type === "liabilities"
                            ? "خصوم"
                            : selectedAccountData.type === "revenue"
                              ? "إيرادات"
                              : selectedAccountData.type === "expenses"
                                ? "مصروفات"
                                : "حقوق ملكية"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">من تاريخ: </span>
                      <span>
                        {accountStatementDateFrom
                          ? format(accountStatementDateFrom, "dd/MM/yyyy")
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">إلى تاريخ: </span>
                      <span>
                        {accountStatementDateTo
                          ? format(accountStatementDateTo, "dd/MM/yyyy")
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-right border border-gray-300 font-semibold">
                          التاريخ
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold">
                          البيان
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold">
                          المرجع
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold text-red-600">
                          مدين
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold text-green-600">
                          دائن
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold text-blue-600">
                          الرصيد
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountTransactions.map((transaction, index) => (
                        <tr
                          key={transaction.id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="p-3 border border-gray-300">
                            {transaction.date}
                          </td>
                          <td className="p-3 border border-gray-300">
                            {transaction.description}
                          </td>
                          <td className="p-3 border border-gray-300">
                            {transaction.reference}
                          </td>
                          <td className="p-3 border border-gray-300 text-red-600 font-medium">
                            {transaction.debit > 0
                              ? transaction.debit.toLocaleString() + " ر.س"
                              : "-"}
                          </td>
                          <td className="p-3 border border-gray-300 text-green-600 font-medium">
                            {transaction.credit > 0
                              ? transaction.credit.toLocaleString() + " ر.س"
                              : "-"}
                          </td>
                          <td className="p-3 border border-gray-300 text-blue-600 font-bold">
                            {transaction.balance.toLocaleString()} ر.س
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-200 font-bold">
                        <td
                          colSpan={3}
                          className="p-3 border border-gray-300 text-center"
                        >
                          الإجمالي
                        </td>
                        <td className="p-3 border border-gray-300 text-red-600">
                          {totalDebit.toLocaleString()} ر.س
                        </td>
                        <td className="p-3 border border-gray-300 text-green-600">
                          {totalCredit.toLocaleString()} ر.س
                        </td>
                        <td className="p-3 border border-gray-300 text-blue-600">
                          {selectedAccountData.balance.toLocaleString()} ر.س
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-red-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 text-red-700">
                        إجمالي المدين
                      </h4>
                      <p className="text-2xl font-bold text-red-600">
                        {totalDebit.toLocaleString()} ر.س
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 text-green-700">
                        إجمالي الدائن
                      </h4>
                      <p className="text-2xl font-bold text-green-600">
                        {totalCredit.toLocaleString()} ر.س
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 text-blue-700">
                        الرصيد النهائي
                      </h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedAccountData.balance.toLocaleString()} ر.س
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {!selectedAccount && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  {isAccountsLoading
                    ? "جاري تحميل الحسابات..."
                    : accounts && accounts.length > 0
                      ? "يرجى اختيار حساب لعرض كشف الحساب"
                      : "لا توجد حسابات متاحة"}
                </p>
                {!isAccountsLoading && (!accounts || accounts.length === 0) && (
                  <div className="mt-4">
                    <Button
                      onClick={refreshAccountsData}
                      variant="outline"
                      className="mx-auto"
                    >
                      إعادة تحميل الحسابات
                    </Button>
                  </div>
                )}
                {!isAccountsLoading && accounts && accounts.length > 0 && (
                  <div className="mt-4 text-sm text-gray-400">
                    المتاح: {accounts.length} حساب
                  </div>
                )}
              </div>
            )}
          </div>
        );
        break;
      case "product-movement":
        reportTitle = "تقرير حركة الصنف";
        const selectedProductData = actualData.products.find(
          (p) => p.id === selectedProduct
        );

        // Generate product movement transactions
        const generateProductMovements = () => {
          if (!selectedProductData || !productMovementDateFrom || !productMovementDateTo) {
            return [];
          }

          const movements = [];
          const startDate = new Date(productMovementDateFrom);
          const endDate = new Date(productMovementDateTo);
          
          // Calculate average purchase price from current stock
          const avgPurchasePrice = selectedProductData.purchasePrice || 
            (selectedProductData.salePrice * 0.7); // Default to 70% of sale price if not available

          let runningQuantity = selectedProductData.quantity;

          // Generate sample movements
          const sampleMovements = [
            { type: "sale", quantity: 5, price: selectedProductData.salePrice },
            { type: "purchase", quantity: 10, price: avgPurchasePrice },
            { type: "sale", quantity: 3, price: selectedProductData.salePrice },
            { type: "sale", quantity: 7, price: selectedProductData.salePrice },
            { type: "purchase", quantity: 15, price: avgPurchasePrice },
            { type: "sale", quantity: 4, price: selectedProductData.salePrice },
          ];

          sampleMovements.forEach((move, index) => {
            const moveDate = new Date(startDate);
            moveDate.setDate(startDate.getDate() + index + 1);

            if (moveDate <= endDate) {
              const isSale = move.type === "sale";
              const purchasePrice = isSale ? avgPurchasePrice : move.price;
              const salePrice = isSale ? move.price : 0;
              const profit = isSale ? (salePrice - purchasePrice) * move.quantity : 0;

              if (isSale) {
                runningQuantity -= move.quantity;
              } else {
                runningQuantity += move.quantity;
              }

              movements.push({
                id: `move-${index}`,
                date: format(moveDate, "yyyy-MM-dd"),
                type: isSale ? "مبيعات" : "مشتريات",
                reference: `${isSale ? "INV" : "PO"}-${String(index + 1).padStart(3, "0")}`,
                quantity: move.quantity,
                purchasePrice: purchasePrice,
                salePrice: isSale ? salePrice : 0,
                profit: profit,
                balance: runningQuantity,
              });
            }
          });

          return movements;
        };

        const productMovements = generateProductMovements();
        const productTotalSales = productMovements
          .filter((m) => m.type === "مبيعات")
          .reduce((sum, m) => sum + m.quantity, 0);
        const productTotalPurchases = productMovements
          .filter((m) => m.type === "مشتريات")
          .reduce((sum, m) => sum + m.quantity, 0);
        const productTotalProfit = productMovements.reduce((sum, m) => sum + m.profit, 0);
        const productTotalSalesValue = productMovements
          .filter((m) => m.type === "مبيعات")
          .reduce((sum, m) => sum + m.salePrice * m.quantity, 0);

        reportContent = (
          <div className="space-y-6">
            {/* Product Selection and Date Range */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-lg">إعدادات تقرير حركة الصنف</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-select">اختيار الصنف</Label>
                  <Select
                    value={selectedProduct}
                    onValueChange={(value) => {
                      setSelectedProduct(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصنف" />
                    </SelectTrigger>
                    <SelectContent>
                      {actualData.products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.code} - {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>من تاريخ</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {productMovementDateFrom
                          ? format(productMovementDateFrom, "dd/MM/yyyy")
                          : "اختر التاريخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={productMovementDateFrom}
                        onSelect={(date) => {
                          setProductMovementDateFrom(date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>إلى تاريخ</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {productMovementDateTo
                          ? format(productMovementDateTo, "dd/MM/yyyy")
                          : "اختر التاريخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={productMovementDateTo}
                        onSelect={(date) => {
                          setProductMovementDateTo(date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {selectedProductData && (
              <div className="space-y-4">
                {/* Product Header */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-indigo-800 mb-2">
                    حركة الصنف: {selectedProductData.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">كود الصنف: </span>
                      <span>{selectedProductData.code}</span>
                    </div>
                    <div>
                      <span className="font-semibold">الرصيد الحالي: </span>
                      <span>{selectedProductData.quantity} قطعة</span>
                    </div>
                    <div>
                      <span className="font-semibold">من تاريخ: </span>
                      <span>
                        {productMovementDateFrom
                          ? format(productMovementDateFrom, "dd/MM/yyyy")
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">إلى تاريخ: </span>
                      <span>
                        {productMovementDateTo
                          ? format(productMovementDateTo, "dd/MM/yyyy")
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 text-blue-700">
                        إجمالي المبيعات
                      </h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {productTotalSales} قطعة
                      </p>
                      <p className="text-sm text-gray-600">
                        {productTotalSalesValue.toLocaleString()} ر.س
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 text-orange-700">
                        إجمالي المشتريات
                      </h4>
                      <p className="text-2xl font-bold text-orange-600">
                        {productTotalPurchases} قطعة
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 text-green-700">
                        إجمالي الأرباح
                      </h4>
                      <p className="text-2xl font-bold text-green-600">
                        {productTotalProfit.toLocaleString()} ر.س
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 text-purple-700">
                        متوسط سعر الشراء
                      </h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {(selectedProductData.purchasePrice || selectedProductData.salePrice * 0.7).toFixed(2)} ر.س
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Movements Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-right border border-gray-300 font-semibold">
                          التاريخ
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold">
                          نوع الحركة
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold">
                          المرجع
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold">
                          الكمية
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold text-orange-600">
                          سعر الشراء
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold text-blue-600">
                          سعر البيع
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold text-green-600">
                          الربح
                        </th>
                        <th className="p-3 text-right border border-gray-300 font-semibold text-purple-600">
                          الرصيد
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productMovements.map((movement, index) => (
                        <tr
                          key={movement.id}
                          className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="p-3 border border-gray-300">
                            {movement.date}
                          </td>
                          <td className="p-3 border border-gray-300">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                movement.type === "مبيعات"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {movement.type}
                            </span>
                          </td>
                          <td className="p-3 border border-gray-300">
                            {movement.reference}
                          </td>
                          <td className="p-3 border border-gray-300 font-medium">
                            {movement.quantity}
                          </td>
                          <td className="p-3 border border-gray-300 text-orange-600 font-medium">
                            {movement.purchasePrice.toFixed(2)} ر.س
                          </td>
                          <td className="p-3 border border-gray-300 text-blue-600 font-medium">
                            {movement.salePrice > 0
                              ? movement.salePrice.toFixed(2) + " ر.س"
                              : "-"}
                          </td>
                          <td className="p-3 border border-gray-300 text-green-600 font-bold">
                            {movement.profit > 0
                              ? movement.profit.toFixed(2) + " ر.س"
                              : "-"}
                          </td>
                          <td className="p-3 border border-gray-300 text-purple-600 font-bold">
                            {movement.balance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-200 font-bold">
                        <td
                          colSpan={3}
                          className="p-3 border border-gray-300 text-center"
                        >
                          الإجمالي
                        </td>
                        <td className="p-3 border border-gray-300">
                          {productTotalSales + productTotalPurchases}
                        </td>
                        <td className="p-3 border border-gray-300 text-orange-600">
                          -
                        </td>
                        <td className="p-3 border border-gray-300 text-blue-600">
                          {productTotalSalesValue.toFixed(2)} ر.س
                        </td>
                        <td className="p-3 border border-gray-300 text-green-600">
                          {productTotalProfit.toFixed(2)} ر.س
                        </td>
                        <td className="p-3 border border-gray-300 text-purple-600">
                          {selectedProductData.quantity}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {!selectedProduct && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  يرجى اختيار صنف لعرض حركة الصنف
                </p>
              </div>
            )}
          </div>
        );
        break;
      default:
        reportTitle = "تقرير غير محدد";
        reportContent = <div>التقرير غير متوفر حالياً</div>;
    }

    setActiveReport({
      title: reportTitle,
      content: reportContent,
    });
    setIsReportOpen(true);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100"
      dir="rtl"
    >
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="p-3 bg-green-500 text-white rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
            التقارير والإحصائيات
          </h1>
          <p className="text-gray-600">
            تقارير شاملة عن الأداء المالي والتشغيلي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                تقرير المبيعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                تقرير شامل عن المبيعات والأرباح
              </p>
              <Button
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => showFinancialReport("sales")}
              >
                عرض التقرير
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                تقرير المشتريات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                تقرير تفصيلي عن المشتريات والموردين
              </p>
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={() => showFinancialReport("purchases")}
              >
                عرض التقرير
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-500" />
                تقرير المخزون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                حالة المخزون والمنتجات
              </p>
              <Button
                className="w-full bg-purple-500 hover:bg-purple-600"
                onClick={() => showFinancialReport("inventory")}
              >
                عرض التقرير
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                حركة الصنف
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                حركة صنف محدد مع الأرباح
              </p>
              <Button
                className="w-full bg-indigo-500 hover:bg-indigo-600"
                onClick={() => showFinancialReport("product-movement")}
              >
                عرض التقرير
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-500" />
                تقرير الأرباح والخسائر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                البيانات المالية والأرباح
              </p>
              <Button
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={() => showFinancialReport("income-statement")}
              >
                عرض التقرير
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-500" />
                تقرير شامل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                تقرير شامل عن جميع العمليات
              </p>
              <Button
                className="w-full bg-teal-500 hover:bg-teal-600"
                onClick={() => showFinancialReport("comprehensive")}
              >
                عرض التقرير
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* التقارير المالية */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <div className="p-2 bg-indigo-500 text-white rounded-lg">
              <BarChart3 className="h-5 w-5" />
            </div>
            التقارير المالية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  إغلاق اليوم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  تقرير شامل لإغلاق اليوم مع المبيعات والحركة المحاسبية
                </p>
                <Button
                  className="w-full bg-indigo-500 hover:bg-indigo-600"
                  onClick={() => showFinancialReport("end-of-day")}
                >
                  عرض التقرير
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-cyan-500" />
                  قائمة المركز المالي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  الميزانية العمومية والأصول والخصوم
                </p>
                <Button
                  className="w-full bg-cyan-500 hover:bg-cyan-600"
                  onClick={() => showFinancialReport("balance-sheet")}
                >
                  عرض التقرير
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  قائمة الأرباح والخسائر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  الإيرادات والمصروفات وصافي الربح
                </p>
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => showFinancialReport("income-statement")}
                >
                  عرض التقرير
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                  قائمة التدفقات النقدية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  التدفقات النقدية الداخلة والخارجة
                </p>
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600"
                  onClick={() => showFinancialReport("cash-flow")}
                >
                  عرض التقرير
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-rose-500" />
                  ميزان المراجعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  يشمل أرصدة جميع الحسابات
                </p>
                <Button
                  className="w-full bg-rose-500 hover:bg-rose-600"
                  onClick={() => showFinancialReport("trial-balance")}
                >
                  عرض التقرير
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-violet-500" />
                  كشف الحساب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  كشف حساب محاسبي مفصل
                </p>
                <Button
                  className="w-full bg-violet-500 hover:bg-violet-600"
                  onClick={() => showFinancialReport("account-statement")}
                >
                  عرض التقرير
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Report Modal */}
        {activeReport && (
          <Dialog
            open={isReportOpen}
            onOpenChange={() => {
              setIsReportOpen(false);
              setActiveReport(null);
            }}
          >
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-semibold">
                    {activeReport.title}
                  </DialogTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePrint}
                      className="flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      طباعة
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportExcel}
                      className="flex items-center gap-2"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportPDF}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsReportOpen(false);
                        setActiveReport(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              <div className="p-4">{activeReport.content}</div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default Reports;