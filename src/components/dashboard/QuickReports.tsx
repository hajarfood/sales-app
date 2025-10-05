import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LineChart,
  Users,
  Moon,
  X,
  Printer,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

interface ReportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const ReportCard = ({
  icon,
  title,
  description,
  onClick = () => {},
}: ReportCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all duration-300 bg-white"
      onClick={onClick}
    >
      <CardContent className="flex items-center p-3 gap-3">
        <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
        <div>
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

interface DirectReportProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

const DirectReport = ({
  title,
  content,
  onClose = () => {},
  isOpen = false,
}: DirectReportProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    // Export to Excel functionality
    alert("تصدير إلى Excel - سيتم تطبيق هذه الوظيفة لاحقاً");
  };

  const handleExportPDF = () => {
    // Export to PDF functionality
    alert("تصدير إلى PDF - سيتم تطبيق هذه الوظيفة لاحقاً");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
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
              <Button size="sm" variant="outline" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="p-4">{content}</div>
      </DialogContent>
    </Dialog>
  );
};

interface QuickReportsProps {
  className?: string;
}

const QuickReports = ({ className = "" }: QuickReportsProps) => {
  const [activeReport, setActiveReport] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const showSalesReport = () => {
    setActiveReport({
      title: "تقرير المبيعات",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">إجمالي المبيعات</h4>
              <p className="text-2xl font-bold text-blue-600">45,600 ر.س</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">عدد الفواتير</h4>
              <p className="text-2xl font-bold text-green-600">127</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800">متوسط الفاتورة</h4>
              <p className="text-2xl font-bold text-purple-600">359 ر.س</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 text-right border">رقم الفاتورة</th>
                  <th className="p-2 text-right border">التاريخ</th>
                  <th className="p-2 text-right border">العميل</th>
                  <th className="p-2 text-right border">المبلغ</th>
                  <th className="p-2 text-right border">الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">#S001</td>
                  <td className="p-2 border">2023-06-20</td>
                  <td className="p-2 border">شركة الأمل</td>
                  <td className="p-2 border">1,500 ر.س</td>
                  <td className="p-2 border">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      مدفوعة
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">#S002</td>
                  <td className="p-2 border">2023-06-19</td>
                  <td className="p-2 border">مؤسسة النور</td>
                  <td className="p-2 border">2,300 ر.س</td>
                  <td className="p-2 border">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      معلقة
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    });
    setIsReportOpen(true);
  };

  const showPurchasesReport = () => {
    setActiveReport({
      title: "تقرير المشتريات",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800">
                إجمالي المشتريات
              </h4>
              <p className="text-2xl font-bold text-orange-600">32,400 ر.س</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800">عدد الطلبات</h4>
              <p className="text-2xl font-bold text-red-600">89</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800">عدد الموردين</h4>
              <p className="text-2xl font-bold text-indigo-600">15</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 text-right border">رقم الطلب</th>
                  <th className="p-2 text-right border">التاريخ</th>
                  <th className="p-2 text-right border">المورد</th>
                  <th className="p-2 text-right border">المبلغ</th>
                  <th className="p-2 text-right border">الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">#P001</td>
                  <td className="p-2 border">2023-06-18</td>
                  <td className="p-2 border">مورد التقنية</td>
                  <td className="p-2 border">5,600 ر.س</td>
                  <td className="p-2 border">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      مستلمة
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">#P002</td>
                  <td className="p-2 border">2023-06-17</td>
                  <td className="p-2 border">شركة الإمداد</td>
                  <td className="p-2 border">3,200 ر.س</td>
                  <td className="p-2 border">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      في الطريق
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    });
    setIsReportOpen(true);
  };

  const showInventoryReport = () => {
    setActiveReport({
      title: "تقرير المخزون",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-semibold text-teal-800">إجمالي المنتجات</h4>
              <p className="text-2xl font-bold text-teal-600">456</p>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h4 className="font-semibold text-cyan-800">قيمة المخزون</h4>
              <p className="text-2xl font-bold text-cyan-600">89,300 ر.س</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800">منتجات منخفضة</h4>
              <p className="text-2xl font-bold text-amber-600">23</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg">
              <h4 className="font-semibold text-rose-800">منتجات نفدت</h4>
              <p className="text-2xl font-bold text-rose-600">7</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 text-right border">اسم المنتج</th>
                  <th className="p-2 text-right border">الكمية</th>
                  <th className="p-2 text-right border">سعر الوحدة</th>
                  <th className="p-2 text-right border">القيمة الإجمالية</th>
                  <th className="p-2 text-right border">الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">لابتوب ديل</td>
                  <td className="p-2 border">25</td>
                  <td className="p-2 border">3,500 ر.س</td>
                  <td className="p-2 border">87,500 ر.س</td>
                  <td className="p-2 border">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      متوفر
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border">ماوس لوجيتك</td>
                  <td className="p-2 border">5</td>
                  <td className="p-2 border">150 ر.س</td>
                  <td className="p-2 border">750 ر.س</td>
                  <td className="p-2 border">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      منخفض
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    });
    setIsReportOpen(true);
  };

  const showProfitReport = () => {
    setActiveReport({
      title: "تقرير الأرباح",
      content: (
        <div className="space-y-4">
          <div className="report-table-container overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 text-right border">رقم الفاتورة</th>
                  <th className="p-2 text-right border">التاريخ</th>
                  <th className="p-2 text-right border">الإيرادات</th>
                  <th className="p-2 text-right border">التكلفة</th>
                  <th className="p-2 text-right border">الربح</th>
                  <th className="p-2 text-right border">هامش الربح</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">#1001</td>
                  <td className="p-2 border">15/06/2023</td>
                  <td className="p-2 border">1,200.00 ر.س</td>
                  <td className="p-2 border">800.00 ر.س</td>
                  <td className="p-2 border text-green-600">400.00 ر.س</td>
                  <td className="p-2 border">33.3%</td>
                </tr>
                <tr>
                  <td className="p-2 border">#1002</td>
                  <td className="p-2 border">16/06/2023</td>
                  <td className="p-2 border">950.00 ر.س</td>
                  <td className="p-2 border">600.00 ر.س</td>
                  <td className="p-2 border text-green-600">350.00 ر.س</td>
                  <td className="p-2 border">36.8%</td>
                </tr>
                <tr>
                  <td className="p-2 border">#1003</td>
                  <td className="p-2 border">17/06/2023</td>
                  <td className="p-2 border">1,500.00 ر.س</td>
                  <td className="p-2 border">1,100.00 ر.س</td>
                  <td className="p-2 border text-green-600">400.00 ر.س</td>
                  <td className="p-2 border">26.7%</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-muted/30 font-bold">
                  <td className="p-2 border" colSpan={2}>
                    الإجمالي
                  </td>
                  <td className="p-2 border">3,650.00 ر.س</td>
                  <td className="p-2 border">2,500.00 ر.س</td>
                  <td className="p-2 border text-green-600">1,150.00 ر.س</td>
                  <td className="p-2 border">31.5%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ),
    });
    setIsReportOpen(true);
  };

  const showCustomersReport = () => {
    setActiveReport({
      title: "تقرير العملاء",
      content: (
        <div className="space-y-4">
          <div className="report-summary grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card className="bg-muted/10">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">ملخص العملاء</h4>
                <p>
                  <strong>إجمالي العملاء:</strong> 24
                </p>
                <p>
                  <strong>إجمالي الطلبات:</strong> 56
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="report-table-container overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 text-right border">اسم العميل</th>
                  <th className="p-2 text-right border">عدد الطلبات</th>
                  <th className="p-2 text-right border">إجمالي المشتريات</th>
                  <th className="p-2 text-right border">متوسط الطلب</th>
                  <th className="p-2 text-right border">آخر طلب</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">شركة الأمل التجارية</td>
                  <td className="p-2 border">12</td>
                  <td className="p-2 border">15,600.00 ر.س</td>
                  <td className="p-2 border">1,300.00 ر.س</td>
                  <td className="p-2 border">18/06/2023</td>
                </tr>
                <tr>
                  <td className="p-2 border">مؤسسة النور</td>
                  <td className="p-2 border">8</td>
                  <td className="p-2 border">9,200.00 ر.س</td>
                  <td className="p-2 border">1,150.00 ر.س</td>
                  <td className="p-2 border">15/06/2023</td>
                </tr>
                <tr>
                  <td className="p-2 border">عميل نقدي</td>
                  <td className="p-2 border">36</td>
                  <td className="p-2 border">18,400.00 ر.س</td>
                  <td className="p-2 border">511.11 ر.س</td>
                  <td className="p-2 border">19/06/2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    });
    setIsReportOpen(true);
  };

  const showComprehensiveReport = () => {
    setActiveReport({
      title: "التقرير الشامل",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">المبيعات</h4>
              <p className="text-xl font-bold text-blue-600">45,600 ر.س</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800">المشتريات</h4>
              <p className="text-xl font-bold text-orange-600">32,400 ر.س</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">الأرباح</h4>
              <p className="text-xl font-bold text-green-600">13,200 ر.س</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800">العملاء</h4>
              <p className="text-xl font-bold text-purple-600">156</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">أفضل المنتجات مبيعاً</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>لابتوب ديل</span>
                  <span className="font-bold">45 قطعة</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>ماوس لوجيتك</span>
                  <span className="font-bold">32 قطعة</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">أفضل العملاء</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>شركة الأمل</span>
                  <span className="font-bold">15,600 ر.س</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>مؤسسة النور</span>
                  <span className="font-bold">9,200 ر.س</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    });
    setIsReportOpen(true);
  };

  const showEndOfDayReport = () => {
    setActiveReport({
      title: "إغلاق اليوم",
      content: (
        <div className="space-y-6">
          {/* Date Filter */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">فلتر التاريخ</h4>
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-sm font-medium mb-1">
                  التاريخ
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    // Filter data based on selected date
                    console.log("Selected date:", e.target.value);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  إلى التاريخ
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    console.log("End date:", e.target.value);
                  }}
                />
              </div>
              <div className="pt-6">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  تطبيق الفلتر
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">المبيعات</h4>
                <p className="text-2xl font-bold">2,450.00 ر.س</p>
                <p className="text-sm text-muted-foreground">8 فواتير</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">الأرباح</h4>
                <p className="text-2xl font-bold">820.00 ر.س</p>
                <p className="text-sm text-muted-foreground">هامش ربح 33.5%</p>
              </CardContent>
            </Card>

            <Card className="bg-amber-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">المصروفات</h4>
                <p className="text-2xl font-bold">350.00 ر.س</p>
                <p className="text-sm text-muted-foreground">3 معاملات</p>
              </CardContent>
            </Card>
          </div>

          <div className="report-table-container overflow-x-auto">
            <h4 className="font-semibold mb-2">ملخص المبيعات</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 text-right border">رقم الفاتورة</th>
                  <th className="p-2 text-right border">الوقت</th>
                  <th className="p-2 text-right border">العميل</th>
                  <th className="p-2 text-right border">المبلغ</th>
                  <th className="p-2 text-right border">طريقة الدفع</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">#1008</td>
                  <td className="p-2 border">09:15</td>
                  <td className="p-2 border">عميل نقدي</td>
                  <td className="p-2 border">320.00 ر.س</td>
                  <td className="p-2 border">نقداً</td>
                </tr>
                <tr>
                  <td className="p-2 border">#1009</td>
                  <td className="p-2 border">11:30</td>
                  <td className="p-2 border">شركة الأمل التجارية</td>
                  <td className="p-2 border">1,250.00 ر.س</td>
                  <td className="p-2 border">تحويل بنكي</td>
                </tr>
                <tr>
                  <td className="p-2 border">#1010</td>
                  <td className="p-2 border">14:45</td>
                  <td className="p-2 border">عميل نقدي</td>
                  <td className="p-2 border">880.00 ر.س</td>
                  <td className="p-2 border">بطاقة ائتمان</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-muted/30 font-bold">
                  <td className="p-2 border" colSpan={3}>
                    الإجمالي
                  </td>
                  <td className="p-2 border" colSpan={2}>
                    2,450.00 ر.س
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ),
    });
    setIsReportOpen(true);
  };

  return (
    <div className={`quick-reports bg-background p-6 rounded-lg ${className}`}>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <LineChart className="h-5 w-5" />
        تقارير سريعة
      </h3>

      <div className="reports-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <ReportCard
          icon={<LineChart className="h-5 w-5 text-green-500" />}
          title="تقرير المبيعات"
          description="تفاصيل المبيعات والفواتير"
          onClick={showSalesReport}
        />

        <ReportCard
          icon={<LineChart className="h-5 w-5 text-blue-500" />}
          title="تقرير المشتريات"
          description="تفاصيل المشتريات والموردين"
          onClick={showPurchasesReport}
        />

        <ReportCard
          icon={<LineChart className="h-5 w-5 text-purple-500" />}
          title="تقرير المخزون"
          description="حالة المخزون والمنتجات"
          onClick={showInventoryReport}
        />

        <ReportCard
          icon={<Users className="h-5 w-5 text-orange-500" />}
          title="تقرير العملاء"
          description="أداء العملاء ومعدلات الشراء"
          onClick={showCustomersReport}
        />

        <ReportCard
          icon={<LineChart className="h-5 w-5 text-red-500" />}
          title="تقرير الأرباح والخسائر"
          description="الأرباح والخسائر التفصيلية"
          onClick={showProfitReport}
        />

        <ReportCard
          icon={<LineChart className="h-5 w-5 text-teal-500" />}
          title="التقرير الشامل"
          description="تقرير شامل عن جميع العمليات"
          onClick={showComprehensiveReport}
        />

        <ReportCard
          icon={<Moon className="h-5 w-5 text-indigo-500" />}
          title="إغلاق اليوم"
          description="تقرير شامل لإغلاق اليوم"
          onClick={showEndOfDayReport}
        />
      </div>

      {activeReport && (
        <DirectReport
          title={activeReport.title}
          content={activeReport.content}
          isOpen={isReportOpen}
          onClose={() => {
            setIsReportOpen(false);
            setActiveReport(null);
          }}
        />
      )}
    </div>
  );
};

export default QuickReports;
